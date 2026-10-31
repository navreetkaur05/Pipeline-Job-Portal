import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pipelineToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.startsWith("/applications")) {
      localStorage.removeItem("pipelineToken");
      localStorage.removeItem("pipelineEmail");
      window.dispatchEvent(new Event("pipeline:auth-expired"));
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (credentials) => {
  const response = await api.post("/auth/register", credentials);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get("/applications");
  return response.data.applications;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (application) => {
  const response = await api.post("/applications", application);
  return response.data.application;
};
