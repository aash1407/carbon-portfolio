import axios from "axios";
import { Project } from "../types/project.types";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

// Add a new project
export const addProject = async (projectData: Project) => {
  const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
  return response.data;
};

// Get all projects
export const getAllProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data;
};

// Delete project
export const deleteProject = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/projects/${id}`);
  return response.data;
};

// Get portfolio quote
export const getPortfolioQuote = async (tons: number) => {
  const response = await axios.post(`${API_BASE_URL}/portfolio`, {
    requestedTons: tons,
  });
  return response.data;
};
