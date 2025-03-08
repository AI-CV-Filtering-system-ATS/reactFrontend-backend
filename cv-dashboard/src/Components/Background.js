import React from "react";
import "./Background.css";
import logoImage from "../Images/logo-slt.png";   

const Background = ({ children }) => {
  return (
    <div className="background-container">
        <div className="background-container" style={{
      backgroundImage: `url(${logoImage}), url(${logoImage})`,
      backgroundPosition: "left bottom, right top",   
      backgroundSize: "150px 180px, 150px 180px",   
      backgroundRepeat: "no-repeat, no-repeat"   
    }}>
      {children}
    </div>
    </div>
  );
};

export default Background;
