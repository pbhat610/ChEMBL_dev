import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Grid, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const FilterPanel = ({ filters, setFilters, visibleFilters }) => {
  const [moleculeTypes, setMoleculeTypes] = useState([]);
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [searchTerm, setSearchTerm] = useState(filters.query);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchMoleculeTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/molecule-types");
        const result = await response.json();
        setMoleculeTypes(result.data);
      } catch (error) {
        console.error("Error fetching molecule types:", error);
      }
    };

    fetchMoleculeTypes();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilters((prevFilters) => ({ ...prevFilters, query: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, setFilters]);

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsModalOpen(false); 
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    Object.keys(tempFilters).forEach((key) => {
      resetFilters[key] = "";
    });
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setSearchTerm("");
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2} alignItems="center">
   
        {visibleFilters.includes("query") && (
          <Grid item xs={12} sm={visibleFilters.includes("molecule_type") ? 6 : 12}>
            <TextField
              label="Search by ChEMBL ID or Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
        )}

     
      
          <Grid item xs={12} sm={visibleFilters.includes("query") ? 6 : 12}>
            <Box display="flex" alignItems="center">
            {visibleFilters.includes("molecule_type") && (
              <TextField
                select
                label="Molecule Type"
                fullWidth
                margin="normal"
                value={tempFilters.molecule_type}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    molecule_type: e.target.value,
                  })
                }
              >
                <MenuItem value="">All</MenuItem>
                {moleculeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
              <Button
                variant="outlined"
                color="primary"
                sx={{ ml: 2, mt: "10px", height: "60px" }}
                onClick={() => setIsModalOpen(true)}
              >
                More Filters
              </Button>
            </Box>
          </Grid>
  
      </Grid>

 
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Additional Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              { key: "full_mwt", label: "Molecular Weight" },
              { key: "alogp", label: "LogP" },
              { key: "hbd", label: "HBD" },
              { key: "hba", label: "HBA" },
              { key: "psa", label: "PSA" },
              { key: "rtb", label: "Rotatable Bonds" },
            ].map(({ key, label }) =>
              visibleFilters.includes(`${key}_min`) && visibleFilters.includes(`${key}_max`) ? (
                <React.Fragment key={key}>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label={`Min ${label}`}
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={tempFilters[`${key}_min`]}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          [`${key}_min`]: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label={`Max ${label}`}
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={tempFilters[`${key}_max`]}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          [`${key}_max`]: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </React.Fragment>
              ) : null
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

 
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={applyFilters} sx={{ mr: 2 }}>
          Apply Filters
        </Button>
        <Button variant="contained" color="secondary" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
};

export default FilterPanel;