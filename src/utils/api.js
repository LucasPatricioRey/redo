import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

export async function checkAdminSession() {
  const { data } = await adminApi.get("/session");
  return data.authenticated;
}

export async function loginAdmin(payload) {
  return adminApi.post("/login", payload);
}

export async function logoutAdmin() {
  return adminApi.post("/logout");
}
