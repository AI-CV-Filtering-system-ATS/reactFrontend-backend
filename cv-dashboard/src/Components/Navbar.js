import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import CSS file
import logo from "../Images/image 29.png"; // Import logo
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Import icons

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserName(parsedUser.fullName || "User");
      } catch (err) {
        console.error("Error parsing user data:", err);
        setUserName("User");
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-button">Home</Link>
      </div>
      <div className="nav-user">
        <FaUserCircle className="user-icon" />
        <span className="user-name">{userName}</span>
        <button 
          onClick={handleLogout} 
          className="logout-button"
          title="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;