import React, { useState, useCallback } from "react";
import CompoundTable from "../components/CompoundTable";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import { fetchCompounds } from "../services/api";

const HomePage = () => {
  return (
    <div>
      <h1>ChEMBL Compound Dashboard</h1>

     
      <CompoundTable/>
    </div>
  );
};

export default HomePage;
