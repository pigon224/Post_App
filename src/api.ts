import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Update to your API's base URL
  withCredentials: true, // Include cookies with every request
});

export default api;
