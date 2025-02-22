import React from "react";
import "./Navbar.css";
import logo from "../../Resources/SltLogo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Company Logo" className="logo-img"  height={50}/>
      </div>
      <div className="navbar-links">
        <ul>
          <li><a href="#home"> </a></li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
