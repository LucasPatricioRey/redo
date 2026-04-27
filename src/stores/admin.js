import { defineStore } from "pinia";
import { adminApi } from "../utils/api.js";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    authenticated: false,
    checkedSession: false,
    loading: false,
  }),
  actions: {
    async restoreSession() {
      try {
        const { data } = await adminApi.get("/session");
        this.authenticated = data.authenticated;
      } catch (error) {
        this.authenticated = false;
      } finally {
        this.checkedSession = true;
      }
    },
    async login(payload) {
      this.loading = true;

      try {
        await adminApi.post("/login", payload);
        this.authenticated = true;
        this.checkedSession = true;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await adminApi.post("/logout");
      this.authenticated = false;
      this.checkedSession = true;
    },
  },
});
