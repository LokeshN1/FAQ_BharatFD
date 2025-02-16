import axios from "axios";
console.log("REACT_APP_SERVER_URL:", process.env.REACT_APP_API_URL);

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : "http://localhost:5000/api",
    withCredentials: true
});