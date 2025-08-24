import React, { useState, useEffect } from 'react';
import './MakePick.css';

function MakePick() {
  const [selectedSport, setSelectedSport] = useState('basketball_nba');
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sports = [
    { key: 'basketball_nba', name: 'NBA Basketball', icon: '🏀' },
    { key: 'americanfootball_nfl', name: 'NFL Football', icon: '🏈' }
  ];

  const fetchOdds = async (sport) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/api/odds/${sport}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch odds');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOdds(data.games);
      } else {
        throw new Error(data.error || 'Failed to fetch odds');
      }
    } catch (err) {
      setError(err.message);
      setOdds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sportKey) => {
    setSelectedSport(sportKey);
    fetchOdds(sportKey);
  };

  const makePick = async (gameId, selectedTeam, odds, marketType = 'h2h') => {
    try {
      const response = await fetch('http://localhost:5000/api/make-pick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: gameId,
          selected_team: selectedTeam,
          odds: odds,
          market_type: marketType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Pick recorded successfully! Pick ID: ${data.pick.id}`);
      } else {
        alert(`Error recording pick: ${data.error}`);
      }
    } catch (err) {
      alert(`Error recording pick: ${err.message}`);
    }
  };

  const formatOdds = (odds) => {
    if (odds === null || odds === undefined) return 'N/A';
    if (odds > 0) {
      return `+${odds}`;
    }
    return odds.toString();
  };

  const formatGameTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  useEffect(() => {
    // Fetch odds for the initially selected sport
    fetchOdds(selectedSport);
  }, []);

  return (
    <div className="make-pick">
      <h1>Make Pick</h1>
      
      {/* Sport Selection */}
      <div className="sport-selection">
        <h2>Select Sport</h2>
        <div className="sport-buttons">
          {sports.map((sport) => (
            <button
              key={sport.key}
              className={`sport-button ${selectedSport === sport.key ? 'active' : ''}`}
              onClick={() => handleSportChange(sport.key)}
            >
              <span className="sport-icon">{sport.icon}</span>
              <span className="sport-name">{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading odds for {sports.find(s => s.key === selectedSport)?.name}...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => fetchOdds(selectedSport)} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Odds Display */}
      {!loading && !error && odds.length > 0 && (
        <div className="odds-section">
          <h2>Upcoming Games - {sports.find(s => s.key === selectedSport)?.name}</h2>
          <div className="games-grid">
            {odds.map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-header">
                  <h3>{game.home_team} vs {game.away_team}</h3>
                  <div className="game-time">{formatGameTime(game.commence_time)}</div>
                  <div className="bookmaker">via {game.bookmaker}</div>
                </div>
                
                <div className="odds-container">
                  <div className="team-odds">
                    <div className="team-name">{game.home_team}</div>
                    <div className="odds">{formatOdds(game.home_odds)}</div>
                    <button 
                      className="pick-button home-pick"
                      onClick={() => makePick(game.id, game.home_team, game.home_odds)}
                    >
                      Pick {game.home_team}
                    </button>
                  </div>
                  
                  <div className="vs-divider">VS</div>
                  
                  <div className="team-odds">
                    <div className="team-name">{game.away_team}</div>
                    <div className="odds">{formatOdds(game.away_odds)}</div>
                    <button 
                      className="pick-button away-pick"
                      onClick={() => makePick(game.id, game.away_team, game.away_odds)}
                    >
                      Pick {game.away_team}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Games Available */}
      {!loading && !error && odds.length === 0 && (
        <div className="no-games">
          <p>No upcoming games available for {sports.find(s => s.key === selectedSport)?.name} at the moment.</p>
          <p>Check back later or try a different sport.</p>
        </div>
      )}
    </div>
  );
}

export default MakePick; 