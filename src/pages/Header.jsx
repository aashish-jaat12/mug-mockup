import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <span className="logo-text">MugDesigner</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="navigation">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/bgwith" 
            className={`nav-link ${location.pathname === '/bgwith' ? 'active' : ''}`}
          >
            Background With
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;