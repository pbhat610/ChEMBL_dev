import React, { useState, useCallback } from "react";
import CompoundTable from "../components/CompoundTable";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import { fetchCompounds } from "../services/api";
import { Button, Box } from "@mui/material";
import CompoundVisualization from "../components/CompoundVisualization";

const HomePage = () => {
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({ molecule_type: "", clinical_phase: "" });
  return (
    <Box m={1}>
    <Button variant="contained" onClick={() => setView(view === "table" ? "visualization" : "table")}>
    {view === "table" ? "Visualize Data" : "Back to Table"}
   
    </Button>
    
    {view === "table" ? <CompoundTable filters={filters} setFilters={setFilters} /> : <CompoundVisualization filters={filters} />}
  </Box>
  );
};

export default HomePage;