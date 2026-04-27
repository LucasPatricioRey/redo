<template>
  <main class="page-shell">
    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow">Barberia y estudio de imagen</p>
        <h1>REDO Studio</h1>
        <p class="hero__lead">
          Cortes, barba y asesoramiento personal en un espacio donde la experiencia empieza antes
          de llegar. Reservas claras, horarios reales y un equipo enfocado en el detalle.
        </p>
        <div class="hero__meta">
          <span>{{ studioInfo.address }}</span>
          <span>{{ studioInfo.phone }}</span>
        </div>
      </div>
      <div class="hero__card">
        <p class="hero__label">Turnos online</p>
        <p class="hero__value">Reservas con disponibilidad real por profesional y horario.</p>
        <router-link class="hero__link" to="/admin-login">Acceso administrador</router-link>
      </div>
    </section>

    <section class="content-grid">
      <article class="content-card">
        <p class="eyebrow">Servicios</p>
        <h2>Una propuesta simple y profesional</h2>
        <p v-if="catalogLoading">Cargando servicios...</p>
        <div v-else class="service-list">
          <div v-for="service in services" :key="service.slug" class="service-item">
            <div>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
            </div>
            <div class="service-item__meta">
              <span>{{ service.duration }} min</span>
              <strong>${{ Number(service.price).toLocaleString("es-AR") }}</strong>
            </div>
          </div>
        </div>
      </article>

      <article class="content-card">
        <p class="eyebrow">Equipo</p>
        <h2>Profesionales con agenda y especialidades definidas</h2>
        <p v-if="catalogLoading">Cargando profesionales...</p>
        <div v-else class="team-list">
          <div v-for="barber in barbers" :key="barber.slug" class="team-item">
            <h3>{{ barber.name }}</h3>
            <p>{{ barber.role }}</p>
            <small>{{ (barber.specialties || []).join(" - ") }}</small>
          </div>
        </div>
      </article>
    </section>

    <section class="booking-section">
      <article class="content-card booking-card">
        <p class="eyebrow">Reserva online</p>
        <h2>Solicitar turno</h2>
        <form class="booking-form" @submit.prevent="submitBooking">
          <div class="form-grid">
            <label>
              Nombre y apellido
              <input v-model="form.customerName" type="text" required />
            </label>
            <label>
              Telefono
              <input v-model="form.customerPhone" type="tel" required />
            </label>
            <label>
              Servicio
              <select v-model="form.serviceSlug" :disabled="catalogLoading || !services.length" required>
                <option disabled value="">Seleccionar servicio</option>
                <option v-for="service in services" :key="service.slug" :value="service.slug">
                  {{ service.name }}
                </option>
              </select>
            </label>
            <label>
              Profesional
              <select v-model="form.barberSlug" :disabled="catalogLoading || !barbers.length" required>
                <option disabled value="">Seleccionar profesional</option>
                <option v-for="barber in barbers" :key="barber.slug" :value="barber.slug">
                  {{ barber.name }}
                </option>
              </select>
            </label>
            <label>
              Fecha
              <input v-model="form.date" :min="minimumDate" type="date" required />
            </label>
            <label>
              Horario
              <select v-model="form.time" :disabled="loadingSlots || !availableSlots.length" required>
                <option disabled value="">
                  {{ loadingSlots ? "Consultando..." : "Seleccionar horario" }}
                </option>
                <option v-for="slot in availableSlots" :key="slot" :value="slot">
                  {{ slot }}
                </option>
              </select>
            </label>
          </div>
          <label>
            Comentarios
            <textarea
              v-model="form.notes"
              rows="4"
              placeholder="Ejemplo: primer visita o preferencia de estilo"
            ></textarea>
          </label>
          <p v-if="slotsMessage" class="form-helper">{{ slotsMessage }}</p>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="form-success">{{ successMessage }}</p>
          <button :disabled="submitting || catalogLoading" type="submit">
            {{ submitting ? "Enviando reserva..." : "Confirmar solicitud" }}
          </button>
        </form>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "../utils/api.js";
import { studioInfo } from "../../shared/site.js";

const services = ref([]);
const barbers = ref([]);
const catalogLoading = ref(true);
const form = reactive({
  customerName: "",
  customerPhone: "",
  serviceSlug: "",
  barberSlug: "",
  date: "",
  time: "",
  notes: "",
});

const availableSlots = ref([]);
const loadingSlots = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const slotsMessage = ref("Selecciona servicio, profesional y fecha para ver horarios reales.");

const minimumDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

async function fetchCatalog() {
  catalogLoading.value = true;

  try {
    const { data } = await api.get("/catalog");
    services.value = data.services || [];
    barbers.value = data.barbers || [];
  } finally {
    catalogLoading.value = false;
  }
}

watch(
  () => [form.serviceSlug, form.barberSlug, form.date],
  async ([serviceSlug, barberSlug, date]) => {
    form.time = "";
    availableSlots.value = [];
    successMessage.value = "";
    errorMessage.value = "";

    if (!serviceSlug || !barberSlug || !date) {
      slotsMessage.value = "Selecciona servicio, profesional y fecha para ver horarios reales.";
      return;
    }

    loadingSlots.value = true;

    try {
      const { data } = await api.get("/availability", {
        params: { serviceSlug, barberSlug, date },
      });

      availableSlots.value = data.slots;
      slotsMessage.value = data.slots.length
        ? "Horarios actualizados segun la agenda disponible."
        : "No hay horarios libres para esa combinacion.";
    } catch (error) {
      slotsMessage.value = "No se pudo consultar la disponibilidad.";
    } finally {
      loadingSlots.value = false;
    }
  }
);

async function submitBooking() {
  errorMessage.value = "";
  successMessage.value = "";
  submitting.value = true;

  try {
    const payload = {
      ...form,
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      notes: form.notes.trim(),
    };

    const { data } = await api.post("/bookings", payload);
    successMessage.value = `${data.message} Te esperamos para confirmar los detalles del turno.`;
    Object.assign(form, {
      customerName: "",
      customerPhone: "",
      serviceSlug: "",
      barberSlug: "",
      date: "",
      time: "",
      notes: "",
    });
    availableSlots.value = [];
    slotsMessage.value = "Selecciona servicio, profesional y fecha para ver horarios reales.";
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "No pudimos registrar la reserva";
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchCatalog);
</script>
