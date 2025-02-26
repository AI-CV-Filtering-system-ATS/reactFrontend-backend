import React from "react";

const CVcard = ({ name, url, extractedText }) => {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      minWidth: "200px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h3>{name}</h3>
      <a href={url} target="_blank" rel="noopener noreferrer">View CV</a>
      <h5>{extractedText} </h5>
    </div>
  );
};

export default CVcard;
