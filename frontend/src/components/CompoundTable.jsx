import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, TextField, MenuItem, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
const CompoundTable = () => {
    const navigate = useNavigate();
  const [compounds, setCompounds] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [filters, setFilters] = useState({
    query: "",
    molecule_type: "",
    full_mwt_min: "",
    full_mwt_max: "",
    alogp_min: "",
    alogp_max: "",
    hbd_min: "",
    hbd_max: "",
    hba_min: "",
    hba_max: "",
    psa_min: "",
    psa_max: "",
    rtb_min: "",
    rtb_max: "",
    max_phase: "",
  });
  const [moleculeTypes, setMoleculeTypes] = useState([]); 
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
    const fetchData = async () => {
      console.log("Fetching Data...", paginationModel);
      let url = `http://localhost:5000/api/compounds?_page=${paginationModel.page + 1}&_limit=${paginationModel.pageSize}`;

     
      if (filters.query) url += `&q=${filters.query}`;

    
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          url += `&${key}=${filters[key]}`;
        }
      });

      try {
        const response = await fetch(url);
        const result = await response.json();
        setCompounds(result.data);
        setTotalRecords(result.totalCount);
      } catch (error) {
        console.error("Error fetching compounds:", error);
      }
    };

    fetchData();
  }, [paginationModel, filters]); 
console.log("compounds ",compounds);

 
  const columns = [
    { field: "chembl_id", headerName: "ChEMBL ID", flex: 1 },
    { field: "pref_name", headerName: "Name", flex: 1 },
    { field: "molecule_type", headerName: "Molecule Type", flex: 1 },
    { field: "max_phase", headerName: "Max Phase", flex: 1, type: "number" },
    { field: "full_mwt", headerName: "Molecular Weight", flex: 1, type: "number" },
    { field: "alogp", headerName: "LogP", flex: 1, type: "number" },
    { field: "hbd", headerName: "HBD", flex: 1, type: "number" },
    { field: "hba", headerName: "HBA", flex: 1, type: "number" },
    { field: "psa", headerName: "PSA", flex: 1, type: "number" },
    { field: "rtb", headerName: "Rotatable Bonds", flex: 1, type: "number" },
  ];

  return (
    <Box m={3}>
      <Typography variant="h4" align="center">ChEMBL Compound Dashboard</Typography>

     
      <TextField
        label="Search by ChEMBL ID or Name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />

     
      <TextField
        select
        label="Molecule Type"
        fullWidth
        margin="normal"
        value={filters.molecule_type}
        onChange={(e) => setFilters({ ...filters, molecule_type: e.target.value })}
      >
        <MenuItem value="">All</MenuItem>
        {moleculeTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

   
      <Grid container spacing={2}>
       
        <Grid item xs={6} md={3}>
          <TextField label="Min Molecular Weight" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, full_mwt_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max Molecular Weight" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, full_mwt_max: e.target.value })} />
        </Grid>

   
        <Grid item xs={6} md={3}>
          <TextField label="Min LogP" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, alogp_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max LogP" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, alogp_max: e.target.value })} />
        </Grid>

     
        <Grid item xs={6} md={3}>
          <TextField label="Min HBD" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, hbd_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max HBD" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, hbd_max: e.target.value })} />
        </Grid>

      
        <Grid item xs={6} md={3}>
          <TextField label="Min HBA" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, hba_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max HBA" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, hba_max: e.target.value })} />
        </Grid>

    
        <Grid item xs={6} md={3}>
          <TextField label="Min PSA" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, psa_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max PSA" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, psa_max: e.target.value })} />
        </Grid>

      
        <Grid item xs={6} md={3}>
          <TextField label="Min Rotatable Bonds" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, rtb_min: e.target.value })} />
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField label="Max Rotatable Bonds" type="number" variant="outlined" fullWidth onChange={(e) => setFilters({ ...filters, rtb_max: e.target.value })} />
        </Grid>
      </Grid>

   
      <DataGrid
        rows={compounds}
        columns={columns}
        getRowId={(row) => row.chembl_id}
        rowCount={totalRecords}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableSelectionOnClick
        autoHeight
        onRowClick={(params) => navigate(`/compound/${params.row.chembl_id}`)} 
      />
    </Box>
  );
};

export default CompoundTable;
