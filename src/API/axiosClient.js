import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://18.140.66.234/api/",
  headers: {
    // "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Referrer-Policy": "unsafe_url",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
  }
});
export default axiosClient;
