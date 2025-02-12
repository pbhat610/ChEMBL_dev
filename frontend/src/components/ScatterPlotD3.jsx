import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Box, Typography, CircularProgress } from "@mui/material";
import { io } from "socket.io-client";

const ScatterPlotD3 = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const[fetchdate,setFetchDate]=useState()
  const socketRef = useRef(null);
  useEffect(() => {
 
    socketRef.current = io("http://localhost:5000");

 
    socketRef.current.on("scatterDataUpdate", (newData) => {
      console.log("newData ",newData);
      setLoading(false)
      setScatterData(newData.data);
      setFetchDate(newData.timestamp)
    });


    return () => {
      socketRef.current.disconnect(); 
    };
  }, []);

  useEffect(() => {
    if (!scatterData.length) return;

 
    const width = 800, height = 500, margin = { top: 30, right: 50, bottom: 60, left: 70 };

   
    d3.select(svgRef.current).selectAll("*").remove();

 
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(scatterData, d => d.x))
      .range([0, width - margin.left - margin.right]);

   
    const yScale = d3.scaleLinear()
      .domain(d3.extent(scatterData, d => d.y))
      .range([height - margin.top - margin.bottom, 0]);


    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2s")));

   
    svg.append("g")
      .call(d3.axisLeft(yScale));

  
    const tooltip = d3.select(tooltipRef.current)
      .style("visibility", "hidden")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)");

 
    svg.selectAll("circle")
      .data(scatterData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 6)
      .attr("fill", "#4a90e2")
      .attr("opacity", 0.7)
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .html(`<strong>MW Bin:</strong> ${d.x} <br><strong>Avg LogP:</strong> ${d.y}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Molecular Weight (200  Bins)");

   
    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("font-size", "14px")
      .text("Avg LogP");

  }, [scatterData]);

  return (
    <Box m={4} p={4} borderRadius={2} boxShadow={3} bgcolor="white" >
      <Typography variant="h6" align="center" gutterBottom>
        Molecular Weight vs LogP (Binned Every 200)  
      </Typography><Typography>Latest data by: {fetchdate}</Typography>

      {loading ? <CircularProgress /> : <svg ref={svgRef}></svg>}
      <div ref={tooltipRef}></div>
    </Box>
  );
};

export default ScatterPlotD3;