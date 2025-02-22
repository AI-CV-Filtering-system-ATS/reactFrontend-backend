import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadFolder from "./pages/uploadFolder/uploadFolder";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadFolder />} />
        <Route path="/hire" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>Hire Page (To be implemented)</h2>} />
      </Routes>
    </Router>
  );
};

export default App;