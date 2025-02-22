
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Footer from "./Components/Footer/Footer";
import Dashboard from "./Views/DashBoard/Dashboard";
import RankingCV from "./Views/Ranking/RankingCV";
// import About from "./components/About";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
         { <Route path="/rankingcv" element={<RankingCV />} /> }
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


