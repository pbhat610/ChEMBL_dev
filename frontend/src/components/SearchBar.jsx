import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <Box display="flex" gap={2} alignItems="center" marginBottom={3}>
            <TextField
                label="Search by ChEMBL ID or Name"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                size="large"
            >
                Search
            </Button>
        </Box>
    );
};

export default SearchBar;
