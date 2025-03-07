import React from "react";
import "./Footer.css";
import logo from "../Images/image 29.png"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="navbar-logo">
        <img src={logo} alt="Company Logo" className="logo-img"  height={40}/>
      </div>
      <b>Powered by SLT Digital Platform</b>
    </footer>
  );
};

export default Footer;
