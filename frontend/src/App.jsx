import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CompoundDetails from "./pages/CompoundDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/compound/:chembl_id" element={<CompoundDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
