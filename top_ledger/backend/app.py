from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask backend

# Configuration
ODDS_API_KEY = os.getenv('ODDS_API_KEY', 'YOUR_API_KEY_HERE')
ODDS_BASE_URL = "https://api.the-odds-api.com/v4"

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Top Ledger Flask API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/odds/<sport>', methods=['GET'])
def get_odds(sport):
    """Get odds for a specific sport"""
    try:
        # Validate sport parameter
        valid_sports = [
            'basketball_nba', 'americanfootball_nfl', 'baseball_mlb',
            'soccer_usa_mls', 'hockey_nhl', 'tennis_atp_singles'
        ]
        
        if sport not in valid_sports:
            return jsonify({
                'success': False,
                'error': f'Invalid sport. Valid options: {", ".join(valid_sports)}'
            }), 400

        # Make request to Odds API
        url = f"{ODDS_BASE_URL}/sports/{sport}/odds"
        params = {
            'apiKey': ODDS_API_KEY,
            'regions': 'us',
            'markets': 'h2h,spreads,totals',  # Get multiple markets
            'oddsFormat': 'american'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        odds_data = response.json()
        
        # Process and format the data
        processed_games = []
        for game in odds_data:
            if game.get('bookmakers'):
                bookmaker = game['bookmakers'][0]
                
                game_info = {
                    'id': game['id'],
                    'home_team': game['home_team'],
                    'away_team': game['away_team'],
                    'commence_time': game['commence_time'],
                    'sport_title': game['sport_title'],
                    'bookmaker': bookmaker['title'],
                    'home_odds': None,  # Initialize these fields
                    'away_odds': None,
                    'markets': {}
                }
                
                # Process different markets (h2h, spreads, totals)
                for market in bookmaker.get('markets', []):
                    market_key = market['key']
                    game_info['markets'][market_key] = []
                    
                    # For head-to-head (h2h) market, extract team odds
                    if market_key == 'h2h':
                        for outcome in market['outcomes']:
                            if outcome['name'] == game['home_team']:
                                game_info['home_odds'] = outcome.get('price')
                            elif outcome['name'] == game['away_team']:
                                game_info['away_odds'] = outcome.get('price')
                    
                    # Store all market data
                    for outcome in market['outcomes']:
                        market_data = {
                            'name': outcome['name'],
                            'price': outcome.get('price'),
                            'point': outcome.get('point')
                        }
                        game_info['markets'][market_key].append(market_data)
                
                processed_games.append(game_info)
        
        # Get API usage info from headers
        remaining_requests = response.headers.get('x-requests-remaining', 'Unknown')
        used_requests = response.headers.get('x-requests-used', 'Unknown')
        
        return jsonify({
            'success': True,
            'games': processed_games,
            'api_info': {
                'remaining_requests': remaining_requests,
                'used_requests': used_requests
            }
        })
        
    except requests.RequestException as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch odds: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }), 500

@app.route('/api/sports', methods=['GET'])
def get_sports():
    """Get list of available sports"""
    try:
        url = f"{ODDS_BASE_URL}/sports"
        params = {'apiKey': ODDS_API_KEY}
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        sports = response.json()
        
        # Filter to show only active sports
        active_sports = [sport for sport in sports if sport.get('active', False)]
        
        return jsonify({
            'success': True,
            'sports': active_sports
        })
        
    except requests.RequestException as e:
        return jsonify({
            'success': False,
            'error': f'Failed to fetch sports: {str(e)}'
        }), 500

@app.route('/api/make-pick', methods=['POST'])
def make_pick():
    """Record a user's pick"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['game_id', 'selected_team', 'odds', 'market_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Here you would typically save to a database
        # For now, we'll just return a success message
        pick_data = {
            'id': f"pick_{datetime.now().timestamp()}",
            'game_id': data['game_id'],
            'selected_team': data['selected_team'],
            'odds': data['odds'],
            'market_type': data['market_type'],
            'timestamp': datetime.now().isoformat(),
            'status': 'pending',
            'user_id': data.get('user_id', 'anonymous')  # Optional user tracking
        }
        
        # In a real app, you'd save this to a database
        # save_pick_to_database(pick_data)
        
        return jsonify({
            'success': True,
            'message': 'Pick recorded successfully',
            'pick': pick_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to record pick: {str(e)}'
        }), 500

@app.route('/api/picks', methods=['GET'])
def get_picks():
    """Get all recorded picks (for demo purposes)"""
    # In a real app, this would fetch from a database
    # For now, return empty array
    return jsonify({
        'success': True,
        'picks': []
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Check if API key is set
    if ODDS_API_KEY == 'YOUR_API_KEY_HERE':
        print("⚠️  Warning: ODDS_API_KEY not set. Please set your API key.")
        print("   You can set it as an environment variable or update the code.")
    
    print("🚀 Starting Top Ledger Flask API...")
    print(f"�� API Key configured: {'Yes' if ODDS_API_KEY != 'YOUR_API_KEY_HERE' else 'No'}")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 