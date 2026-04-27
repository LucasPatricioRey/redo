<template>
  <main class="redo-home">
    <header class="redo-header">
      <div class="redo-header__inner">
        <a class="redo-header__brand" href="#inicio">
          <img :src="redoLogo" alt="Logo de REDO" />
        </a>

        <nav class="redo-header__nav">
          <a href="#servicios">Servicios</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#enfoque">Enfoque</a>
          <a href="#reserva">Contacto</a>
        </nav>

        <a class="redo-header__cta" :href="whatsappBaseLink" target="_blank" rel="noreferrer">
          Reservar turno
        </a>
      </div>
    </header>

    <section id="inicio" class="redo-hero" :style="{ backgroundImage: `url(${redoBanner})` }"></section>

    <section id="nosotros" class="redo-intro">
      <div class="redo-intro__copy">
        <p class="redo-kicker">Nosotros</p>
        <h2>8 anos de trayectoria en Floresta, con foco en belleza, color y salud capilar.</h2>
        <p>
          Somos REDO, un salon unisex nacido en el barrio con una propuesta que mezcla tecnica,
          diagnostico y una atencion simple de entender. Nos especializamos en corte, balayage,
          coloracion, brushing, ondas, peinados y servicios de belleza que acompanen cada momento.
        </p>
        <p>
          Nuestro equipo trabaja con una mirada actual y cercana, priorizando el estado del cabello
          antes de cada servicio y acompanando a cada cliente con recomendaciones reales para el
          cuidado diario y la duracion del resultado.
        </p>
        <div class="redo-intro__actions">
          <a class="redo-button redo-button--secondary" href="#reserva">Reservar online</a>
          <a class="redo-button redo-button--outline" href="#servicios">Ver servicios</a>
        </div>
      </div>

      <div class="redo-intro__media">
        <img :src="redoAbout" alt="Profesional trabajando un balayage en REDO" />
      </div>
    </section>

    <section id="servicios" class="redo-services">
      <div class="redo-section-head">
        <p class="redo-kicker">Servicios</p>
        <h2>Una carta pensada para una peluqueria integral, actual y versatil.</h2>
      </div>

      <p v-if="catalogLoading" class="redo-state">Cargando servicios...</p>
      <div v-else class="redo-services__grid">
        <article v-for="service in displayServices" :key="service.slug" class="redo-service-card">
          <img :src="service.image" :alt="service.name" />
          <div class="redo-service-card__body">
            <h3>{{ service.name }}</h3>
            <p>{{ service.description }}</p>
            <div class="redo-service-card__meta">
              <span>{{ service.duration }} min</span>
              <strong>${{ Number(service.price).toLocaleString("es-AR") }}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="enfoque" class="redo-values">
      <div class="redo-section-head">
        <p class="redo-kicker">Nuestro enfoque</p>
        <h2>Detalles que hacen que REDO se sienta como un salon real y bien cuidado.</h2>
      </div>

      <div class="redo-values__grid">
        <article class="redo-value-card">
          <h3>Diagnostico personalizado</h3>
          <p>
            Antes de cada servicio evaluamos base, textura y objetivo final para elegir la mejor
            tecnica y cuidar el resultado desde el primer paso.
          </p>
        </article>
        <article class="redo-value-card">
          <h3>Servicios para cada ocasion</h3>
          <p>
            Desde un corte fresco de todos los dias hasta un peinado especial o una manicuria
            prolija para eventos, REDO acompana distintos momentos.
          </p>
        </article>
        <article class="redo-value-card">
          <h3>Reserva simple</h3>
          <p>
            La agenda online muestra disponibilidad real y permite continuar la confirmacion por
            WhatsApp de forma directa y clara.
          </p>
        </article>
      </div>
    </section>

    <section id="reserva" class="redo-booking">
      <article class="redo-booking__panel">
        <div class="redo-section-head redo-section-head--compact">
          <p class="redo-kicker">Contacto y reservas</p>
          <h2>Solicitar turno</h2>
        </div>

        <form class="redo-form" @submit.prevent="submitBooking">
          <div class="redo-form__grid">
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
              <select v-model="form.serviceSlug" :disabled="catalogLoading || !displayServices.length" required>
                <option disabled value="">Seleccionar servicio</option>
                <option v-for="service in displayServices" :key="service.slug" :value="service.slug">
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
              placeholder="Contanos si queres color, brushing, mechas, un peinado especial o algun detalle importante"
            ></textarea>
          </label>

          <div class="redo-form__footer">
            <div class="redo-form__messages">
              <p v-if="slotsMessage" class="redo-helper">{{ slotsMessage }}</p>
              <p v-if="errorMessage" class="redo-error">{{ errorMessage }}</p>
            </div>
            <button :disabled="submitting || catalogLoading" class="redo-button redo-button--primary" type="submit">
              {{ submitting ? "Enviando reserva..." : "Confirmar solicitud" }}
            </button>
          </div>
        </form>

        <div v-if="reservationSummary" class="redo-success">
          <p class="redo-kicker">Reserva enviada</p>
          <h3>Solicitud recibida correctamente</h3>
          <p class="redo-success__message">{{ successMessage }}</p>
          <div class="redo-success__grid">
            <span>Servicio: <strong>{{ reservationSummary.serviceName }}</strong></span>
            <span>Profesional: <strong>{{ reservationSummary.barberName }}</strong></span>
            <span>Fecha: <strong>{{ reservationSummary.date }}</strong></span>
            <span>Horario: <strong>{{ reservationSummary.time }}</strong></span>
          </div>
          <a class="redo-button redo-button--secondary" :href="whatsappLink" target="_blank" rel="noreferrer">
            Confirmar por WhatsApp
          </a>
        </div>
      </article>

      <aside class="redo-contact-card">
        <img :src="redoLogo" alt="Logo de REDO" class="redo-contact-card__logo" />
        <p>{{ studioInfo.address }}</p>
        <p>Buenos Aires, Argentina</p>
        <a :href="whatsappBaseLink" target="_blank" rel="noreferrer">{{ studioInfo.phone }}</a>

        <div class="redo-contact-card__services">
          <strong>Servicios destacados</strong>
          <ul>
            <li v-for="service in displayServices" :key="service.slug">{{ service.name }}</li>
          </ul>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "../utils/api.js";
import { services as preferredServices, studioInfo } from "../../shared/site.js";
import redoAbout from "../assets/redo-about.png";
import redoBanner from "../assets/redo-banner.png";
import redoLogo from "../assets/redo-logo-black.png";
import serviceBalayage from "../assets/service-balayage.png";
import serviceBrushing from "../assets/service-brushing.png";
import serviceColor from "../assets/service-color.png";
import serviceCorte from "../assets/service-corte.png";
import serviceManicuria from "../assets/service-manicuria.png";
import serviceMechas from "../assets/service-mechas.png";
import serviceOndas from "../assets/service-ondas.png";
import servicePeinadosEspeciales from "../assets/service-peinados-especiales.png";

const serviceImageMap = {
  corte: serviceCorte,
  balayage: serviceBalayage,
  color: serviceColor,
  mechas: serviceMechas,
  brushing: serviceBrushing,
  ondas: serviceOndas,
  "peinados-especiales": servicePeinadosEspeciales,
  manicuria: serviceManicuria,
};

const services = ref([]);
const barbers = ref([]);
const catalogLoading = ref(true);
const availableSlots = ref([]);
const loadingSlots = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const reservationSummary = ref(null);
const resettingAfterSubmit = ref(false);
const slotsMessage = ref("Selecciona servicio, profesional y fecha para ver horarios reales.");

const form = reactive({
  customerName: "",
  customerPhone: "",
  serviceSlug: "",
  barberSlug: "",
  date: "",
  time: "",
  notes: "",
});

const minimumDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const whatsappBaseLink = computed(() => `https://wa.me/${studioInfo.phone.replace(/\D/g, "")}`);

const whatsappLink = computed(() => {
  if (!reservationSummary.value) {
    return whatsappBaseLink.value;
  }

  const message = encodeURIComponent(
    `Hola REDO, envie una reserva para ${reservationSummary.value.serviceName} con ${reservationSummary.value.barberName} el ${reservationSummary.value.date} a las ${reservationSummary.value.time}.`
  );

  return `${whatsappBaseLink.value}?text=${message}`;
});

const displayServices = computed(() =>
  preferredServices.map((preferredService) => {
    const liveService = services.value.find((item) => item.slug === preferredService.slug);
    const source = liveService || preferredService;

    return {
      ...source,
      image: serviceImageMap[preferredService.slug] || redoAbout,
    };
  })
);

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
    errorMessage.value = "";

    if (!resettingAfterSubmit.value) {
      successMessage.value = "";
      reservationSummary.value = null;
    }

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
    } catch {
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
    const selectedService = displayServices.value.find((item) => item.slug === payload.serviceSlug);
    const selectedBarber = barbers.value.find((item) => item.slug === payload.barberSlug);

    const { data } = await api.post("/bookings", payload);
    successMessage.value = `${data.message} Tambien vas a poder seguir la conversacion por WhatsApp.`;
    reservationSummary.value = {
      serviceName: selectedService?.name || payload.serviceSlug,
      barberName: selectedBarber?.name || payload.barberSlug,
      date: payload.date,
      time: payload.time,
    };

    resettingAfterSubmit.value = true;
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
    window.open(whatsappLink.value, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      resettingAfterSubmit.value = false;
    }, 0);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "No pudimos registrar la reserva";
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  fetchCatalog();
});
</script>
