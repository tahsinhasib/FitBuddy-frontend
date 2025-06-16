import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000", // Update if hosted differently
    withCredentials: true, // If you're using cookies or auth headers
});

export default api;