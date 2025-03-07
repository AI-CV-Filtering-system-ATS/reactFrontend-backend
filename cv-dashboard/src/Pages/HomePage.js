import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";
import Background from "../Components/Background"; // Import the component


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Background>
    <div className="home-page">
      <p className="Hometitle">Welcome to the CV Dashboard</p>
      <p className="Hometitle2">Upload, Analyze, and Rank CVs with Ease!</p>
      <div className="button-container">
        <button className="blue-button" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        <button className="blue-button" onClick={() => navigate('/cv-upload')}>Upload CV</button>
        <button className="blue-button" onClick={() => navigate('/cv-rank')}>CV Rank</button>
      </div>
    </div>
    </Background>
  );
};

export default HomePage;
