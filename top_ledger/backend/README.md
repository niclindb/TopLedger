# Top Ledger Flask Backend

Flask API backend for the Top Ledger sports betting application.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set your API key:**
   ```bash
   # Option 1: Create .env file
   cp .env.example .env
   # Edit .env and add your Odds API key
   
   # Option 2: Set environment variable
   export ODDS_API_KEY=your_actual_api_key_here
   ```

3. **Run the server:**
   ```bash
   python run.py
   # or
   python app.py
   ```

## API Endpoints

- `GET /` - Health check
- `GET /api/sports` - Get available sports
- `GET /api/odds/<sport>` - Get odds for a specific sport
- `POST /api/make-pick` - Record a user's pick
- `GET /api/picks` - Get all recorded picks

## Environment Variables

- `ODDS_API_KEY` - Your Odds API key (required)
- `FLASK_DEBUG` - Enable debug mode (default: True)
- `SECRET_KEY` - Flask secret key (default: dev key)

## Testing

Test the API with curl:
```bash
# Health check
curl http://localhost:5000/

# Get NBA odds
curl http://localhost:5000/api/odds/basketball_nba

# Get available sports
curl http://localhost:5000/api/sports
```

## Security Features

- API keys never exposed to frontend
- CORS enabled for React frontend
- Input validation on all endpoints
- Error handling for API failures 