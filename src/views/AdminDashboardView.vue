<template>
  <main class="page-shell">
    <section class="dashboard-head">
      <div>
        <p class="eyebrow">Gestion de reservas</p>
        <h1>Panel REDO</h1>
      </div>
      <button class="secondary-button" @click="logout">Cerrar sesion</button>
    </section>

    <section class="stats-grid">
      <article class="dashboard-card stat-card">
        <span>Pendientes</span>
        <strong>{{ summary.pendiente }}</strong>
      </article>
      <article class="dashboard-card stat-card">
        <span>Confirmadas</span>
        <strong>{{ summary.confirmado }}</strong>
      </article>
      <article class="dashboard-card stat-card">
        <span>Canceladas</span>
        <strong>{{ summary.cancelado }}</strong>
      </article>
    </section>

    <section class="dashboard-card">
      <div class="filters-row">
        <label>
          Estado
          <select v-model="filters.status" @change="fetchBookings">
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmadas</option>
            <option value="cancelado">Canceladas</option>
          </select>
        </label>
        <label>
          Buscar
          <input v-model="filters.search" type="search" placeholder="Nombre, telefono o servicio" />
        </label>
        <button class="secondary-button" @click="fetchBookings">Actualizar</button>
      </div>

      <p v-if="feedbackMessage" class="form-success">{{ feedbackMessage }}</p>
      <p v-if="loading">Cargando reservas...</p>
      <p v-else-if="!bookings.length">No hay reservas para los filtros actuales.</p>

      <div v-else class="booking-admin-list">
        <article v-for="booking in bookings" :key="booking._id" class="booking-admin-item">
          <div class="booking-admin-item__head">
            <div>
              <h3>{{ booking.customerName }}</h3>
              <p>{{ booking.serviceName }} con {{ booking.barberName }}</p>
            </div>
            <span class="status-pill" :data-status="booking.status">{{ booking.status }}</span>
          </div>
          <div class="booking-admin-item__meta">
            <span>{{ booking.date }} · {{ booking.time }}</span>
            <span>{{ booking.customerPhone }}</span>
          </div>
          <p v-if="booking.notes" class="booking-admin-item__notes">{{ booking.notes }}</p>
          <div class="actions-row">
            <button
              class="secondary-button"
              :disabled="statusLoadingId === booking._id"
              @click="updateStatus(booking._id, 'pendiente')"
            >
              Marcar pendiente
            </button>
            <button
              class="action-button action-button--confirm"
              :disabled="statusLoadingId === booking._id"
              @click="updateStatus(booking._id, 'confirmado')"
            >
              {{ statusLoadingId === booking._id ? "Actualizando..." : "Confirmar" }}
            </button>
            <button
              class="action-button action-button--cancel"
              :disabled="statusLoadingId === booking._id"
              @click="updateStatus(booking._id, 'cancelado')"
            >
              Cancelar
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "../stores/admin.js";
import { adminApi } from "../utils/api.js";

const router = useRouter();
const adminStore = useAdminStore();
const loading = ref(false);
const bookings = ref([]);
const feedbackMessage = ref("");
const statusLoadingId = ref("");
const filters = reactive({
  status: "todos",
  search: "",
});
const summary = reactive({
  total: 0,
  pendiente: 0,
  confirmado: 0,
  cancelado: 0,
});

async function fetchBookings() {
  loading.value = true;
  feedbackMessage.value = "";

  try {
    const { data } = await adminApi.get("/bookings", {
      params: {
        status: filters.status,
        search: filters.search,
      },
    });

    bookings.value = data.bookings;
  } catch (error) {
    if (error.response?.status === 401) {
      await adminStore.logout();
      router.push("/admin-login");
    }
  } finally {
    loading.value = false;
  }
}

async function fetchSummary() {
  const { data } = await adminApi.get("/summary");
  Object.assign(summary, data.summary);
}

async function logout() {
  await adminStore.logout();
  router.push("/admin-login");
}

async function updateStatus(id, status) {
  statusLoadingId.value = id;

  try {
    await adminApi.patch(`/bookings/${id}/status`, { status });
    feedbackMessage.value = `La reserva se actualizo a ${status}.`;
    await Promise.all([fetchBookings(), fetchSummary()]);
  } finally {
    statusLoadingId.value = "";
  }
}

onMounted(async () => {
  await Promise.all([fetchBookings(), fetchSummary()]);
});
</script>
