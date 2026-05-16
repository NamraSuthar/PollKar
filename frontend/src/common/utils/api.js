import axios from "axios";
import { clearAccessToken, getAccessToken } from "./auth-token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();

      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
