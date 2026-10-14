import axios from "axios";
import { getUser, removeUser } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// add token to every request
api.interceptors.request.use((config) => {
  const user = getUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// if token is invalid or expired -> logout user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/login") || error.config?.url?.includes("/register");

    if (error.response?.status === 401 && !isAuthRoute) {
      removeUser();
      window.location.href = "/login?expired=true";
    }
    return Promise.reject(error);
  }
);

// get a readable error message from axios error
export const getErrorMessage = (error) => {
  if (!error.response) {
    return "Network error! Please check your internet or try again later.";
  }
  return error.response.data?.message || "Something went wrong";
};

export default api;
