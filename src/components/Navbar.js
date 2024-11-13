import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ensure the CSS file is linked

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/wishlist" className="navbar-link">Wishlist</Link>
        </li>
        <li className="navbar-item">
          <Link to="/already-travelled" className="navbar-link">Already Travelled</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;