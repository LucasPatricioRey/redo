<template>
  <main class="center-shell center-shell--admin">
    <section class="auth-card auth-card--admin">
      <div class="auth-card__top">
        <p class="eyebrow">Acceso interno</p>
        <span class="auth-card__badge">REDO</span>
      </div>
      <h1>Panel de administracion</h1>
      <p class="section-helper">
        Ingresá para gestionar reservas, servicios, profesionales, horarios y bloqueos manuales.
      </p>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <label>
          Usuario
          <input v-model="form.username" type="text" autocomplete="username" required />
        </label>
        <label>
          Clave
          <input v-model="form.password" type="password" autocomplete="current-password" required />
        </label>
        <button :disabled="loading" type="submit">
          {{ loading ? "Ingresando..." : "Entrar al panel" }}
        </button>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { loginAdmin } from "../utils/api.js";

const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");
const form = reactive({
  username: "",
  password: "",
});

async function handleSubmit() {
  errorMessage.value = "";
  loading.value = true;

  try {
    await loginAdmin(form);
    router.push("/admin");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "No se pudo iniciar sesion";
  } finally {
    loading.value = false;
  }
}
</script>
