import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@supabase/supabase-js";


export async function POST(request: NextRequest) {
    try {
        const { betData }  = await request.json();
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                headers: {
                Authorization: request.headers.get("Authorization") || ""
                }
                }   
            }
        );
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const userId = userData.user.id;

        if (!betData) {
            return NextResponse.json(
                { error: 'Bet data is required' },
                { status: 400 }
            )
        }


        const now = new Date().toISOString(); // placed_at

        if (betData.startsAt < now){
            return NextResponse.json(
                {
                  message: 'Cannot place bet on already started game',
                  ok: true,
                },
                { status: 200 }
              );
              
        }
        const payout = calculatePayout(Number(betData.odds), Number(betData.stake));
        // Insert into db
        const { data, error } = await supabase
        .from('Bets')
        .insert([
            {
            game_id: betData.gameId,
            sport: betData.sport,
            home_team: betData.home,
            away_team: betData.away,
            bet_label: betData.pick,
            bet_point: betData.point || null,
            odds: betData.odds,
            stake: betData.stake,
            potential_payout: payout,
            placed_at: now,
            status: 'pending',
            user_id: userId,
            start_time: betData.startsAt,
            }
        ]);
        if(error){
            console.error('Error inserting bet:', error)
            return NextResponse.json(
                { error: 'Error placing bet' },
                { status: 500 }
            )
        }
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error parsing request body:', error)
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }
}

function calculatePayout(odds: number, stake: number){
    if (isNaN(odds) || stake <= 0) return 0;

    let payout = 0;
    if (odds > 0) payout = stake * (1 + odds / 100);
    else payout = stake * (1 + 100 / Math.abs(odds));
    return payout.toFixed(2);
}