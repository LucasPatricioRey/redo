import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});
