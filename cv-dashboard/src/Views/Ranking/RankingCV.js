import React, { useState } from "react";
import './RankingCV.css';
import CVcard from "../../Components/Card/CVcard";
import { cvList } from "../../Resources/CvList";

function RankingCV() {
    const [input, setInput] = useState("");
    const [showCVList, setShowCVList] = useState(false);

    const handleSubmit = () => {
        alert(`Generating ranking for: ${input}`);
        setShowCVList(true); // Show the CV list after clicking submit
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

            {showCVList && (
                <div className="cv-list-container"> {/* Added wrapper for scrolling */}
                    <h2>Ranked CVs</h2>
                    <div className="cv-list">
                        {cvList.map((cv, index) => (
                            <CVcard key={index} url={cv.cvUrl} name={cv.name} extractedText={cv.extractedText} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RankingCV;






  


