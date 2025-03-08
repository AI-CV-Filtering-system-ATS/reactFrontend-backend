import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/HomePage'; 
import Dashboard from './Pages/Dashboard';
import CVRank from './Pages/CVRank';
import Footer from './Components/Footer';
import UploadFolder from "./Pages/uploadFolder";


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cv-upload"  element={<UploadFolder />}  />
          <Route path="/cv-rank" element={<CVRank />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
