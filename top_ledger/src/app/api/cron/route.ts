import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getGameWinner(scores: any[] | null): string | null {
    if (!scores || scores.length < 2) return null;
  
    const [teamA, teamB] = scores;
  
    if (
      teamA.score === undefined || teamA.score === null ||
      teamB.score === undefined || teamB.score === null
    ) {
      return null;
    }
  
    if (teamA.score === teamB.score) return 'Draw';
  
    return teamA.score > teamB.score ? teamA.name : teamB.name;
  }
  
async function getGameResult(gameId: string, sport: string) {
  try {
    const apiKey = process.env.ODDS_KEY;
    if (!apiKey) {
      throw new Error('Missing ODDS_KEY environment variable');
    }

    const url = new URL(`https://api.the-odds-api.com/v4/sports/${encodeURIComponent(sport)}/scores`);
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('daysFrom', '3'); // Get games from last 3 days
    url.searchParams.set('dateFormat', 'iso');
    url.searchParams.set('eventIds', gameId); // Filter to specific game

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Scores API error: ${response.status}`);
    }

    const data = await response.json();
    const game = data.length > 0 ? data[0] : null;
    
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    // Return game data with scores
    return {
      gameId: game.id,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      completed: game.completed,
      scores: game.scores,
    };

  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    return null;
  }
}

function determineBetOutcome(bet: any, gameResult: any) {
    const totalScore = gameResult.scores[0].score + gameResult.scores[1].score;
    const teamA = gameResult.scores[0];
    const teamB = gameResult.scores[1];
    let outcome = "pending";
  
    switch (true) {
      // Moneyline bet
      case !bet.bet_point: {
        const winner = getGameWinner(gameResult.scores);
        outcome = bet.bet_label === winner ? "won" : "lost";
        break;
      }
  
      // Under bet
      case bet.bet_label === "Under": {
        if (totalScore < bet.bet_point) outcome = "won";
        else if (totalScore > bet.bet_point) outcome = "lost";
        else outcome = "push";
        break;
      }
  
      // Over bet
      case bet.bet_label === "Over": {
        if (totalScore > bet.bet_point) outcome = "won";
        else if (totalScore < bet.bet_point) outcome = "lost";
        else outcome = "push";
        break;
      }
  
      // Spread bet — team A
      case bet.bet_label === teamA.name: {
        const diff = teamA.score - teamB.score + bet.bet_point;
        if (diff > 0) outcome = "won";
        else if (diff < 0) outcome = "lost";
        else outcome = "push";
        break;
      }
      // Spread bet — team B
      case bet.bet_label === teamB.name: {
        const diff = teamB.score - teamA.score + bet.bet_point;
        if (diff > 0) outcome = "won";
        else if (diff < 0) outcome = "lost";
        else outcome = "push";
        break;
      }
  
      default:
        outcome = "pending";
    }
  
    return {
      betId: bet.id,
      outcome,
    };
  }
  

export async function GET() {
  try {
    console.log("cron job activated.")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!,
    );

    // get games that should already be done. 
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    const cutoffTime = twoHoursAgo.toISOString();

    // Query for pending bets where start_time was at least 2 hours ago
    const { data: bets, error } = await supabase
      .from('Bets')
      .select('*')
      .eq('status', 'pending')
      .lt('start_time', cutoffTime); // start time is less than 2 hours ago

    if (error) {
      console.error('Error fetching bets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bets' },
        { status: 500 }
      );
    }

    if (bets && bets.length > 0) {
        await Promise.all(
          bets.map(async (bet) => {
            try {
              console.log(`Processing bet ${bet.id} for game ${bet.game_id}`);
      
              // Get game result from odds API
              const gameResult = await getGameResult(bet.game_id, bet.sport);
              if (!gameResult) {
                console.log(`Could not get result for game ${bet.game_id}`);
                return;
              }
              
              // Skip if game is not completed
              if (!gameResult.completed) return;
      
              // Determine bet outcome
              const betOutcome = determineBetOutcome(bet, gameResult);
              console.log("betOucoe", betOutcome)
              // Update the bet in Supabase
              let payout =  bet.potential_payout
              if(betOutcome.outcome == 'lost') payout = 0
              else if(betOutcome.outcome == 'push') payout = bet.stake
              await supabase
                .from('Bets')
                .update({
                  potential_payout: payout,
                  status: betOutcome.outcome,
                })
                .eq('id', bet.id);
              
              
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            // Update user profile after bet settlement
            fetch(`${baseUrl}/api/updateProfile`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                betId: bet.id
              })
            });
      
            } catch (err) {
              console.error(`Error processing bet ${bet.id}:`, err);
            }
          })
        );
      }
      

    return NextResponse.json({ 
      ok: true, 
      count: bets?.length || 0,
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}