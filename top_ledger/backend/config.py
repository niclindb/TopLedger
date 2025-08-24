import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class for the Flask app"""
    
    # Odds API Configuration
    ODDS_API_KEY = os.getenv('ODDS_API_KEY', 'YOUR_API_KEY_HERE')
    ODDS_BASE_URL = "https://api.the-odds-api.com/v4"
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # API Configuration
    REQUEST_TIMEOUT = 10  # seconds
    MAX_REQUESTS_PER_MINUTE = 60
    
    # Valid sports for the API
    VALID_SPORTS = [
        'basketball_nba',
        'americanfootball_nfl', 
        'baseball_mlb',
        'soccer_usa_mls',
        'hockey_nhl',
        'tennis_atp_singles',
        'golf_pga_championship',
        'mma_ufc'
    ] 