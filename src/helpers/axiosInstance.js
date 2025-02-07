import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

const getToken = () => localStorage.getItem("token");

axiosInstance.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
