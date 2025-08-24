import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import MakePick from './pages/MakePick/MakePick';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav className="App-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/make-pick" className="nav-link">Make Pick</Link>
          </nav>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={
              <div className="home-content">
                <h1>Welcome to Top Ledger</h1>
                <p>Your sports betting ledger application</p>
                <Link to="/make-pick" className="cta-button">Make a Pick</Link>
              </div>
            } />
            <Route path="/make-pick" element={<MakePick />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
