import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminLoginView from "../views/AdminLoginView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import { checkAdminSession } from "../utils/api.js";

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
  try {
    const authenticated = await checkAdminSession();
    return authenticated ? true : { name: "admin-login" };
  } catch (error) {
    return { name: "admin-login" };
  }
});

export default router;
