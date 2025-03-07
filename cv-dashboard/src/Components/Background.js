import React from "react";
import "./Background.css";
import logoImage from "../Images/logo-slt.png";  // Adjust the path if necessary

const Background = ({ children }) => {
  return (
    <div className="background-container">
        <div className="background-container" style={{
      backgroundImage: `url(${logoImage}), url(${logoImage})`,
      backgroundPosition: "left bottom, right top",  // Position the images in the corners
      backgroundSize: "150px 180px, 150px 180px",  // Adjust the size of the images
      backgroundRepeat: "no-repeat, no-repeat"  // Ensure the images do not repeat
    }}>
      {children}
    </div>
    </div>
  );
};

export default Background;
