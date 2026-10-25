import axios from "axios";
import { AUTH_KEY } from "./context/AuthContext.jsx";

// Uses VITE_API_URL when deployed (set in Netlify), localhost when running locally.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// Attach the JWT token to every request.
api.interceptors.request.use((config) => {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (saved && saved.token) {
      config.headers.Authorization = `Bearer ${saved.token}`;
    }
  } catch {
    // ignore a corrupted saved login
  }
  return config;
});

// If the token is missing/expired (401), clear the login and show the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.includes("/auth/")) {
      localStorage.removeItem(AUTH_KEY);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ----- auth -----
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ----- my applications -----
export const getApplications = (status) =>
  api.get("/applications", { params: status ? { status } : {} });
export const getStats = () => api.get("/applications/stats");
export const createApplication = (data) => api.post("/applications", data);
export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

// ----- admin only -----
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminApplications = () => api.get("/admin/applications");
export const getAdminStats = () => api.get("/admin/stats");
