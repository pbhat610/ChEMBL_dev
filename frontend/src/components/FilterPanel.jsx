import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const FilterPanel = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        molecule_type: "",
        full_mwt_min: "",
        full_mwt_max: "",
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        onFilter(filters);
    };

    return (
        <Box display="flex" gap={2} alignItems="center" marginBottom={2}>
            <TextField
                label="Molecule Type"
                name="molecule_type"
                variant="outlined"
                value={filters.molecule_type}
                onChange={handleChange}
            />
            <TextField
                label="Min Molecular Weight"
                name="full_mwt_min"
                type="number"
                variant="outlined"
                value={filters.full_mwt_min}
                onChange={handleChange}
            />
            <TextField
                label="Max Molecular Weight"
                name="full_mwt_max"
                type="number"
                variant="outlined"
                value={filters.full_mwt_max}
                onChange={handleChange}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={applyFilters}
                size="large"
            >
                Apply Filters
            </Button>
        </Box>
    );
};

export default FilterPanel;
