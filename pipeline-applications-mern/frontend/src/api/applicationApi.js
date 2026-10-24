import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" }
});

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

export const updateApplication = async (id, updates) => {
  const response = await api.patch(`/applications/${id}`, updates);
  return response.data.application;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};
