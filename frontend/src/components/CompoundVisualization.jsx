import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Box, Typography,Grid, Card, CardContent, CircularProgress } from "@mui/material";
import { Chart, registerables } from "chart.js";
import FilterPanel from "./FilterPanel"; 
import * as d3 from "d3";
import ScatterPlot from "./ScatterPlotD3";
Chart.register(...registerables);

const CompoundVisualization = () => {
  const [chartData, setChartData] = useState({
    molecularWeight: [],
    moleculeType: [],
    logP: []
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    molecule_type: "",
    hba_min: "",
    hba_max: "",
    psa_min: "",
    psa_max: "",
    full_mwt_min: "",
    full_mwt_max: "",
    alogp_min: "",
    alogp_max: "",
  });

  useEffect(() => {
    const fetchChartData = async () => {
      const params = new URLSearchParams(filters); 
      try {
        const response = await fetch(`http://localhost:5000/api/chart-data?${params.toString()}`);
        const data = await response.json();
        setLoading(false)
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [filters]); 

  return (
    <Box m={3}>
      <Typography variant="h4" align="center">Compound Data Visualization</Typography>

   
      <FilterPanel filters={filters} setFilters={setFilters} visibleFilters={[
        "hba_min", "hba_max", "psa_min", "psa_max", "full_mwt_min", "full_mwt_max", "alogp_min", "alogp_max"
      ]} />
  <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">
                Molecular Weight Distribution
              </Typography>
              <Box sx={{ width: "100%", height: "400px", margin: "auto" }}>
               {loading?<CircularProgress/>: <Bar
                  data={{
                    labels: chartData.molecularWeight.map(
                      (d) => `${d.range_start}`-`${d.range_start + 100}`
                    ),
                    datasets: [
                      {
                        label: "Molecular Weight",
                        data: chartData.molecularWeight.map((d) => d.count),
                        backgroundColor: "#8884d8",
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Molecule Type Distribution</Typography>
              <Box sx={{ width: "100%", height: "400px", margin: "auto" }}>
              {loading?<CircularProgress/>: <Pie
                  data={{
                    labels: chartData.moleculeType.map((d) => d.name),
                    datasets: [
                      {
                        data: chartData.moleculeType.map((d) => d.value),
                        backgroundColor: chartData.moleculeType.map(
                          (_, i) => d3.schemeCategory10[i % 10]
                        ),
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />}
              </Box>
            </CardContent>
          </Card>
        </Grid>

     
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">LogP Distribution</Typography>
              <Box sx={{ width: "100%", height: "400px", margin: "auto" }}>
              {loading?<CircularProgress/>: <Bar
                  data={{
                    labels: chartData.logP.map(
                      (d) => `${d.range_start}`-`${d.range_start + 1}`
                    ),
                    datasets: [
                      {
                        label: "LogP",
                        data: chartData.logP.map((d) => d.count),
                        backgroundColor: "#82ca9d",
                      },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                />}
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12}>
          
              <Typography variant="h6">ScatterPlot</Typography>
              
                <ScatterPlot/>
       
         
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompoundVisualization;