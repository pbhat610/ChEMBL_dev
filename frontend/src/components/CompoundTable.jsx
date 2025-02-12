import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FilterPanel from "./FilterPanel"; 

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

  useEffect(() => {
    const fetchData = async () => {
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

  return (
    <Box m={2} >  
      <Typography variant="h4" align="center">ChEMBL Compound Dashboard</Typography>

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        visibleFilters={[
          "query", "molecule_type", "full_mwt_min", "full_mwt_max", "alogp_min", "alogp_max", "hbd_min", "hbd_max"
        ]}
      />

    
      <Box sx={{ flexGrow: 1, height: "60vh" }}>  
        <DataGrid
          rows={compounds}
          columns={[
            { field: "chembl_id", headerName: "ChEMBL ID", flex: 1 },
            { field: "pref_name", headerName: "Name", flex: 1 },
            { field: "molecule_type", headerName: "Molecule Type", flex: 1 },
            { field: "max_phase", headerName: "Max Phase", flex: 1, type: "number" },
            { field: "full_mwt", headerName: "Molecular Weight", flex: 1, type: "number" },
          ]}
          getRowId={(row) => row.chembl_id}
          rowCount={totalRecords}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableSelectionOnClick
          autoHeight={false} 
          onRowClick={(params) => navigate(`/compound/${params.row.chembl_id}`)}
        />
      </Box>
    </Box>
  

  
  );
};

export default CompoundTable;