import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchCompounds = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/compounds`, { params });
    return response.data; 
  } catch (error) {
    console.error("Error fetching compounds:", error);
    throw error;
  }
};
