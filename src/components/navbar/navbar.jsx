import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // Import CSS file
import logo from "../../assets/logo.png"; // Import logo
import { FaUserCircle } from "react-icons/fa"; // Import user icon

const Navbar = () => {
  const userName = "Esandu Obadaarahchchi"; // Replace with dynamic user data if available

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/hire" className="nav-button">Hire</Link>
      </div>
      <div className="nav-user">
        <FaUserCircle className="user-icon" />
        <span className="user-name">{userName}</span>
      </div>
    </nav>
  );
};

export default Navbar;