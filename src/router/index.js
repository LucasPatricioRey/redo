import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminLoginView from "../views/AdminLoginView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import { useAdminStore } from "../stores/admin.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/admin-login", name: "admin-login", component: AdminLoginView },
    {
      path: "/admin",
      name: "admin",
      component: AdminDashboardView,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true;
  }

  const adminStore = useAdminStore();

  if (!adminStore.checkedSession) {
    await adminStore.restoreSession();
  }

  if (!adminStore.authenticated) {
    return { name: "admin-login" };
  }

  return true;
});

export default router;
