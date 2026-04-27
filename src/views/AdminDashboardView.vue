<template>
  <main class="page-shell page-shell--admin">
    <section class="dashboard-head dashboard-head--admin">
      <div class="dashboard-head__copy">
        <p class="eyebrow">Gestion de reservas</p>
        <h1>Panel REDO</h1>
        <p class="section-helper">
          Organiza la agenda, responde reservas y mantene actualizada la propuesta del salon desde
          un solo lugar.
        </p>
      </div>
      <div class="actions-row">
        <button class="secondary-button" @click="goHome">Volver al sitio</button>
        <button class="secondary-button" @click="logout">Cerrar sesion</button>
      </div>
    </section>

    <section class="stats-grid">
      <article class="dashboard-card stat-card">
        <span>Pendientes</span>
        <strong>{{ counters.pendiente }}</strong>
      </article>
      <article class="dashboard-card stat-card">
        <span>Confirmadas</span>
        <strong>{{ counters.confirmado }}</strong>
      </article>
      <article class="dashboard-card stat-card">
        <span>Canceladas</span>
        <strong>{{ counters.cancelado }}</strong>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="dashboard-card">
        <p class="eyebrow">Reservas</p>
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
        <p v-if="loading.bookings">Cargando reservas...</p>
        <p v-else-if="!bookings.length">No hay reservas para los filtros actuales.</p>

        <div v-else class="booking-admin-list">
          <article v-for="booking in visibleBookings" :key="booking._id" class="booking-admin-item">
            <div class="booking-admin-item__head">
              <div>
                <h3>{{ booking.customerName }}</h3>
                <p>{{ booking.serviceName }} con {{ booking.barberName }}</p>
              </div>
              <span class="status-pill" :data-status="booking.status">{{ booking.status }}</span>
            </div>
            <div class="booking-admin-item__meta">
              <span>{{ booking.date }} - {{ booking.time }}</span>
              <span>{{ booking.customerPhone }}</span>
            </div>
            <p v-if="booking.notes" class="booking-admin-item__notes">{{ booking.notes }}</p>
            <div class="actions-row">
              <button class="secondary-button" @click="openBookingEditor(booking)">Editar</button>
              <button
                class="secondary-button"
                :disabled="statusLoadingId === booking._id"
                @click="updateStatus(booking._id, 'pendiente')"
              >
                Pendiente
              </button>
              <button
                class="action-button action-button--confirm"
                :disabled="statusLoadingId === booking._id"
                @click="updateStatus(booking._id, 'confirmado')"
              >
                Confirmar
              </button>
              <button
                class="action-button action-button--cancel"
                :disabled="statusLoadingId === booking._id"
                @click="updateStatus(booking._id, 'cancelado')"
              >
                Cancelar
              </button>
              <button class="action-button action-button--danger" @click="removeBooking(booking._id)">
                Eliminar
              </button>
            </div>
          </article>
        </div>
        <button
          v-if="bookings.length > maxVisibleItems"
          class="secondary-button secondary-button--full"
          @click="showAllBookings = !showAllBookings"
        >
          {{ showAllBookings ? "Ver menos reservas" : "Ver mas reservas" }}
        </button>
      </article>

      <article class="dashboard-card">
        <p class="eyebrow">Edicion de reserva</p>
        <p v-if="!bookingEditor.id">Selecciona una reserva para editarla.</p>
        <form v-else class="booking-form" @submit.prevent="saveBookingEdit">
          <div class="form-grid">
            <label>
              Nombre
              <input v-model="bookingEditor.customerName" type="text" required />
            </label>
            <label>
              Telefono
              <input v-model="bookingEditor.customerPhone" type="tel" required />
            </label>
            <label>
              Servicio
              <select v-model="bookingEditor.serviceSlug" required>
                <option v-for="service in services" :key="service._id || service.slug" :value="service.slug">
                  {{ service.name }}
                </option>
              </select>
            </label>
            <label>
              Profesional
              <select v-model="bookingEditor.barberSlug" required>
                <option v-for="barber in barbers" :key="barber._id || barber.slug" :value="barber.slug">
                  {{ barber.name }}
                </option>
              </select>
            </label>
            <label>
              Fecha
              <input v-model="bookingEditor.date" type="date" required />
            </label>
            <label>
              Horario
              <select v-model="bookingEditor.time" required>
                <option v-for="slot in editSlots" :key="slot" :value="slot">{{ slot }}</option>
              </select>
            </label>
          </div>
          <label>
            Comentarios
            <textarea v-model="bookingEditor.notes" rows="3"></textarea>
          </label>
          <button type="submit">Guardar cambios</button>
        </form>
      </article>

      <article class="dashboard-card">
        <p class="eyebrow">Servicios</p>
        <form class="stack-form" @submit.prevent="saveService">
          <input v-model="serviceForm.name" type="text" placeholder="Nombre del servicio" required />
          <input v-model="serviceForm.description" type="text" placeholder="Descripcion del servicio" required />
          <label>
            Precio
            <input v-model.number="serviceForm.price" type="number" min="0" step="1000" placeholder="Ejemplo: 18000" required />
          </label>
          <div class="actions-row">
            <button type="submit">{{ serviceForm.id ? "Actualizar servicio" : "Agregar servicio" }}</button>
            <button v-if="serviceForm.id" class="secondary-button" type="button" @click="resetServiceForm">Cancelar</button>
          </div>
        </form>
        <div class="simple-list">
          <article v-for="service in visibleServices" :key="service._id || service.slug" class="simple-item">
            <div>
              <strong>{{ service.name }}</strong>
              <p>${{ Number(service.price).toLocaleString("es-AR") }}</p>
            </div>
            <div class="actions-row">
              <button class="secondary-button" @click="editService(service)">Editar</button>
              <button class="action-button action-button--danger" @click="removeService(service._id)">Eliminar</button>
            </div>
          </article>
        </div>
        <button
          v-if="services.length > maxVisibleItems"
          class="secondary-button secondary-button--full"
          type="button"
          @click="showAllServices = !showAllServices"
        >
          {{ showAllServices ? "Ver menos servicios" : "Ver mas servicios" }}
        </button>
      </article>

      <article class="dashboard-card">
        <p class="eyebrow">Profesionales</p>
        <form class="stack-form" @submit.prevent="saveBarber">
          <input v-model="barberForm.name" type="text" placeholder="Nombre" required />
          <input v-model="barberForm.role" type="text" placeholder="Rol" required />
          <input v-model="barberForm.specialties" type="text" placeholder="Especialidades separadas por coma" required />
          <div class="actions-row">
            <button type="submit">{{ barberForm.id ? "Actualizar profesional" : "Agregar profesional" }}</button>
            <button v-if="barberForm.id" class="secondary-button" type="button" @click="resetBarberForm">Cancelar</button>
          </div>
        </form>
        <div class="simple-list">
          <article v-for="barber in visibleBarbers" :key="barber._id || barber.slug" class="simple-item">
            <div>
              <strong>{{ barber.name }}</strong>
              <p>{{ barber.role }}</p>
            </div>
            <div class="actions-row">
              <button class="secondary-button" @click="editBarber(barber)">Editar</button>
              <button class="action-button action-button--danger" @click="removeBarber(barber._id)">Eliminar</button>
            </div>
          </article>
        </div>
        <button
          v-if="barbers.length > maxVisibleItems"
          class="secondary-button secondary-button--full"
          type="button"
          @click="showAllBarbers = !showAllBarbers"
        >
          {{ showAllBarbers ? "Ver menos profesionales" : "Ver mas profesionales" }}
        </button>
      </article>

      <article class="dashboard-card">
        <p class="eyebrow">Agenda semanal</p>
        <p class="section-helper">Define desde que hora hasta que hora se toman turnos cada dia.</p>
        <div class="simple-list">
          <article v-for="day in dayEntries" :key="day.key" class="simple-item">
            <div class="schedule-editor">
              <strong>{{ day.label }}</strong>
              <label class="checkbox-line">
                <input v-model="schedule[day.key].enabled" type="checkbox" />
                Habilitado
              </label>
              <div class="form-grid form-grid--two">
                <label>
                  Desde
                  <input v-model="schedule[day.key].open" type="time" :disabled="!schedule[day.key].enabled" />
                </label>
                <label>
                  Hasta
                  <input v-model="schedule[day.key].close" type="time" :disabled="!schedule[day.key].enabled" />
                </label>
              </div>
            </div>
          </article>
        </div>
        <button @click="saveSchedule">Guardar agenda</button>
        <p v-if="scheduleMessage" class="form-success">{{ scheduleMessage }}</p>
      </article>

      <article class="dashboard-card">
        <p class="eyebrow">Bloqueos manuales</p>
        <form class="stack-form" @submit.prevent="saveBlock">
          <input v-model="blockForm.date" type="date" required />
          <select v-model="blockForm.barberSlug">
            <option value="all">Todo el equipo</option>
            <option v-for="barber in barbers" :key="barber._id || barber.slug" :value="barber.slug">
              {{ barber.name }}
            </option>
          </select>
          <div class="form-grid form-grid--two">
            <input v-model="blockForm.startTime" type="time" required />
            <input v-model="blockForm.endTime" type="time" required />
          </div>
          <input v-model="blockForm.reason" type="text" placeholder="Motivo del bloqueo" />
          <button type="submit">Agregar bloqueo</button>
        </form>
        <div class="simple-list">
          <article v-for="block in visibleBlocks" :key="block._id" class="simple-item">
            <div>
              <strong>{{ block.date }} - {{ block.startTime }} / {{ block.endTime }}</strong>
              <p>{{ block.barberSlug === "all" ? "Todo el equipo" : block.barberSlug }} - {{ block.reason || "Sin motivo" }}</p>
            </div>
            <button class="action-button action-button--danger" @click="removeBlock(block._id)">Eliminar</button>
          </article>
        </div>
        <button
          v-if="blocks.length > maxVisibleItems"
          class="secondary-button secondary-button--full"
          type="button"
          @click="showAllBlocks = !showAllBlocks"
        >
          {{ showAllBlocks ? "Ver menos bloqueos" : "Ver mas bloqueos" }}
        </button>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { adminApi, api, logoutAdmin } from "../utils/api.js";

const router = useRouter();
const loading = reactive({
  bookings: false,
  catalog: false,
});
const feedbackMessage = ref("");
const statusLoadingId = ref("");
const bookings = ref([]);
const services = ref([]);
const barbers = ref([]);
const blocks = ref([]);
const editSlots = ref([]);
const scheduleMessage = ref("");
const maxVisibleItems = 4;
const showAllBookings = ref(false);
const showAllServices = ref(false);
const showAllBarbers = ref(false);
const showAllBlocks = ref(false);

const dayEntries = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miercoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sabado" },
  { key: "sunday", label: "Domingo" },
];

const filters = reactive({
  status: "todos",
  search: "",
});

const schedule = reactive({
  monday: { enabled: true, open: "10:00", close: "20:00" },
  tuesday: { enabled: true, open: "10:00", close: "20:00" },
  wednesday: { enabled: true, open: "10:00", close: "20:00" },
  thursday: { enabled: true, open: "10:00", close: "20:00" },
  friday: { enabled: true, open: "10:00", close: "20:00" },
  saturday: { enabled: true, open: "10:00", close: "18:00" },
  sunday: { enabled: false, open: "", close: "" },
});

const bookingEditor = reactive({
  id: "",
  customerName: "",
  customerPhone: "",
  serviceSlug: "",
  barberSlug: "",
  date: "",
  time: "",
  notes: "",
});

const serviceForm = reactive({
  id: "",
  name: "",
  description: "",
  duration: 60,
  price: 0,
});

const barberForm = reactive({
  id: "",
  name: "",
  role: "",
  specialties: "",
});

const blockForm = reactive({
  date: "",
  barberSlug: "all",
  startTime: "",
  endTime: "",
  reason: "",
});

const counters = computed(() =>
  bookings.value.reduce(
    (accumulator, booking) => {
      accumulator[booking.status] += 1;
      return accumulator;
    },
    { pendiente: 0, confirmado: 0, cancelado: 0 }
  )
);

const visibleBookings = computed(() =>
  showAllBookings.value ? bookings.value : bookings.value.slice(0, maxVisibleItems)
);

const visibleServices = computed(() =>
  showAllServices.value ? services.value : services.value.slice(0, maxVisibleItems)
);

const visibleBarbers = computed(() =>
  showAllBarbers.value ? barbers.value : barbers.value.slice(0, maxVisibleItems)
);

const visibleBlocks = computed(() =>
  showAllBlocks.value ? blocks.value : blocks.value.slice(0, maxVisibleItems)
);

function resetServiceForm() {
  Object.assign(serviceForm, {
    id: "",
    name: "",
    description: "",
    duration: 60,
    price: 0,
  });
}

function resetBarberForm() {
  Object.assign(barberForm, {
    id: "",
    name: "",
    role: "",
    specialties: "",
  });
}

function resetBlockForm() {
  Object.assign(blockForm, {
    date: "",
    barberSlug: "all",
    startTime: "",
    endTime: "",
    reason: "",
  });
}

async function fetchBookings() {
  loading.bookings = true;

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
      await logoutAdmin();
      router.push("/admin-login");
    }
  } finally {
    loading.bookings = false;
  }
}

async function fetchCatalog() {
  loading.catalog = true;

  try {
    const [catalogResponse, barbersResponse, settingsResponse, blocksResponse] = await Promise.all([
      adminApi.get("/services"),
      adminApi.get("/barbers"),
      adminApi.get("/settings"),
      adminApi.get("/blocks"),
    ]);

    services.value = catalogResponse.data.services;
    barbers.value = barbersResponse.data.barbers;
    blocks.value = blocksResponse.data.blocks;
    Object.assign(schedule, settingsResponse.data.schedule);
  } catch (error) {
    if (error.response?.status === 401) {
      await logoutAdmin();
      router.push("/admin-login");
    }
  } finally {
    loading.catalog = false;
  }
}

async function loadEditSlots() {
  if (!bookingEditor.serviceSlug || !bookingEditor.barberSlug || !bookingEditor.date) {
    editSlots.value = [];
    return;
  }

  const { data } = await api.get("/availability", {
    params: {
      serviceSlug: bookingEditor.serviceSlug,
      barberSlug: bookingEditor.barberSlug,
      date: bookingEditor.date,
    },
  });

  editSlots.value = Array.from(new Set([bookingEditor.time, ...(data.slots || [])])).sort();
}

function openBookingEditor(booking) {
  Object.assign(bookingEditor, {
    id: booking._id,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    serviceSlug: booking.serviceSlug,
    barberSlug: booking.barberSlug,
    date: booking.date,
    time: booking.time,
    notes: booking.notes || "",
  });
  loadEditSlots();
}

async function saveBookingEdit() {
  await adminApi.patch("/bookings", {
    mode: "edit",
    ...bookingEditor,
  });
  feedbackMessage.value = "La reserva se actualizo correctamente.";
  await fetchBookings();
}

async function updateStatus(id, status) {
  statusLoadingId.value = id;

  try {
    await adminApi.patch("/bookings", { id, mode: "status", status });
    feedbackMessage.value = `La reserva se actualizo a ${status}.`;
    await fetchBookings();
  } finally {
    statusLoadingId.value = "";
  }
}

async function removeBooking(id) {
  await adminApi.delete("/bookings", { params: { id } });
  feedbackMessage.value = "La reserva se elimino.";
  if (bookingEditor.id === id) {
    bookingEditor.id = "";
  }
  await fetchBookings();
}

function editService(service) {
  Object.assign(serviceForm, {
    id: service._id,
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
  });
}

async function saveService() {
  const method = serviceForm.id ? "put" : "post";
  await adminApi[method]("/services", serviceForm);
  feedbackMessage.value = "Servicios actualizados.";
  resetServiceForm();
  await fetchCatalog();
}

async function removeService(id) {
  await adminApi.delete("/services", { params: { id } });
  feedbackMessage.value = "Servicio eliminado.";
  await fetchCatalog();
}

function editBarber(barber) {
  Object.assign(barberForm, {
    id: barber._id,
    name: barber.name,
    role: barber.role,
    specialties: (barber.specialties || []).join(", "),
  });
}

async function saveBarber() {
  const method = barberForm.id ? "put" : "post";
  await adminApi[method]("/barbers", barberForm);
  feedbackMessage.value = "Profesionales actualizados.";
  resetBarberForm();
  await fetchCatalog();
}

async function removeBarber(id) {
  await adminApi.delete("/barbers", { params: { id } });
  feedbackMessage.value = "Profesional eliminado.";
  await fetchCatalog();
}

async function saveSchedule() {
  await adminApi.put("/settings", { schedule });
  feedbackMessage.value = "Agenda semanal actualizada.";
  scheduleMessage.value = "La agenda se guardo correctamente.";
}

async function saveBlock() {
  await adminApi.post("/blocks", blockForm);
  feedbackMessage.value = "Bloqueo agregado.";
  resetBlockForm();
  await fetchCatalog();
}

async function removeBlock(id) {
  await adminApi.delete("/blocks", { params: { id } });
  feedbackMessage.value = "Bloqueo eliminado.";
  await fetchCatalog();
}

async function logout() {
  await logoutAdmin();
  router.push("/admin-login");
}

function goHome() {
  router.push("/");
}

watch(
  () => [bookingEditor.serviceSlug, bookingEditor.barberSlug, bookingEditor.date],
  () => {
    if (bookingEditor.id) {
      loadEditSlots();
    }
  }
);

onMounted(async () => {
  await Promise.all([fetchBookings(), fetchCatalog()]);
});
</script>
