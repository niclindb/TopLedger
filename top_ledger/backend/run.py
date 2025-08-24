#!/usr/bin/env python3
"""
Startup script for Top Ledger Flask API
"""

import os
import sys
from app import app

def check_environment():
    """Check if required environment variables are set"""
    api_key = os.getenv('ODDS_API_KEY')
    
    if not api_key or api_key == 'YOUR_API_KEY_HERE':
        print("❌ Error: ODDS_API_KEY not set!")
        print("   Please set your Odds API key in the .env file")
        print("   or as an environment variable.")
        print("\n   Example:")
        print("   export ODDS_API_KEY=your_actual_api_key_here")
        return False
    
    print("✅ Environment check passed")
    return True

def main():
    """Main startup function"""
    print("🏈 Top Ledger Flask API")
    print("=" * 40)
    
    if not check_environment():
        sys.exit(1)
    
    print("🚀 Starting Flask development server...")
    print("📱 API will be available at: http://localhost:5000")
    print("🔗 React frontend should connect to: http://localhost:5000")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    main() 