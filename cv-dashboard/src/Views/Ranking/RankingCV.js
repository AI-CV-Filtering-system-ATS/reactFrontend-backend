import React, { useState } from "react";
import './RankingCV.css';


// const RankingCV = () => {
    // return (
        // <div className="rank-container">
        //   <h2>Rank Cv</h2>
        //   <input type="text" placeholder="type anything!" className="input-field" />
        //   <button className="rank-btn">Generate Ranking</button>
        // </div>
    //   );
//   };


  function RankingCV() {
    const [input, setInput] = useState("");
  
    const handleSubmit = () => {
      alert(`Generating ranking for: ${input}`);
    };
  
    return (
        <div className="ranking-container">
          <h1 className="title">Welcome to CV Ranker</h1>
          <p className="subtitle">Upload, Analyze, and Rank CVs with Ease!</p>
          
          <div className="rank-box">
            <h2>Rank CV</h2>
            <input
              type="text"
              placeholder="Type anything!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSubmit}>Generate Ranking</button>
          </div>
        </div>
      );
    }
  
  export default RankingCV;
  


