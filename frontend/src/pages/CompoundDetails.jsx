import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Paper, Grid } from "@mui/material";


import OCL from "openchemlib/full";

const CompoundDetails = () => {
  const { chembl_id } = useParams();
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moleculeSVG, setMoleculeSVG] = useState("");
  useEffect(() => {
    const fetchCompoundDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/compounds/${chembl_id}`);
        const data = await response.json();
        setCompound(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching compound details:", error);
      }
    };

    fetchCompoundDetails();
  }, [chembl_id]);

  useEffect(() => {
    if (compound?.canonical_smiles) {
      try {
        const molecule = OCL.Molecule.fromSmiles(compound.canonical_smiles);
        const svg = molecule.toSVG(300, 300); 
        setMoleculeSVG(svg);
      } catch (error) {
        console.error("Error rendering molecular structure:", error);
      }
    }
  }, [compound]);

  if (loading) return <CircularProgress />;

  return (
    <Box m={3}>
      <Typography variant="h4" align="center">Compound Details</Typography>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Grid container spacing={3}>
          {/* Compound Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">General Information</Typography>
            <Typography><strong>ChEMBL ID:</strong> {compound.chembl_id}</Typography>
            <Typography><strong>Preferred Name:</strong> {compound.pref_name || "N/A"}</Typography>
            <Typography><strong>Molecule Type:</strong> {compound.molecule_type}</Typography>
            <Typography><strong>Max Phase:</strong> {compound.max_phase || "N/A"}</Typography>
            <Typography><strong>First Approval Year:</strong> {compound.first_approval || "N/A"}</Typography>
          </Grid>

          {/* Molecular Structure */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Molecular Structure</Typography>
            <div dangerouslySetInnerHTML={{ __html: moleculeSVG }} /> 
          </Grid>

          {/* Molecular Properties */}
          <Grid item xs={12}>
            <Typography variant="h6">Molecular Properties</Typography>
            <Typography><strong>Molecular Weight:</strong> {compound.full_mwt}</Typography>
            <Typography><strong>LogP:</strong> {compound.alogp}</Typography>
            <Typography><strong>HBA (Hydrogen Bond Acceptors):</strong> {compound.hba}</Typography>
            <Typography><strong>HBD (Hydrogen Bond Donors):</strong> {compound.hbd}</Typography>
            <Typography><strong>PSA (Polar Surface Area):</strong> {compound.psa}</Typography>
            <Typography><strong>TPSA:</strong> {compound.tpsa || "N/A"}</Typography>
            <Typography><strong>Rotatable Bonds:</strong> {compound.rtb}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CompoundDetails;
