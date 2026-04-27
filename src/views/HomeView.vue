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

    <section id="inicio" class="redo-hero" :style="{ backgroundImage: `url(${redoBanner})` }">
      <div class="redo-hero__overlay"></div>
      <div class="redo-hero__content">
        <p class="redo-kicker">Salon unisex en Floresta</p>
        <h1>Peluqueria & estetica integral</h1>
        <p>
          Corte, color, brushing y tratamientos en un espacio pensado para una experiencia prolija,
          cercana y actual.
        </p>
        <div class="redo-hero__actions">
          <a class="redo-button redo-button--primary" href="#reserva">Solicitar turno</a>
          <a class="redo-button redo-button--ghost" href="#servicios">Ver servicios</a>
        </div>
      </div>
    </section>

    <section id="nosotros" class="redo-intro">
      <div class="redo-intro__copy">
        <p class="redo-kicker">Nosotros</p>
        <h2>8 anos de trayectoria en Floresta, con foco en belleza, color y salud capilar.</h2>
        <p>
          Somos REDO, un salon unisex nacido en el barrio con una propuesta que mezcla tecnica,
          diagnostico y una atencion simple de entender. Nos especializamos en corte, balayage,
          coloracion, brushing y tratamientos pensados para realzar cada estilo sin perder naturalidad.
        </p>
        <p>
          Nuestro equipo trabaja con una mirada actual y cercana, priorizando el estado del cabello
          antes de cada servicio y acompanando a cada cliente con recomendaciones reales para el
          cuidado diario.
        </p>
        <a class="redo-button redo-button--secondary" href="#reserva">Reservar online</a>
      </div>

      <div class="redo-intro__media">
        <img :src="redoAbout" alt="Profesional trabajando un balayage en REDO" />
      </div>
    </section>

    <section id="servicios" class="redo-services">
      <div class="redo-section-head">
        <p class="redo-kicker">Servicios</p>
        <h2>Una carta pensada para una peluqueria unisex moderna y funcional.</h2>
      </div>

      <p v-if="catalogLoading" class="redo-state">Cargando servicios...</p>
      <div v-else class="redo-services__grid">
        <article v-for="service in serviceCards" :key="service.slug" class="redo-service-card">
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
            Antes de cada servicio evaluamos textura, base, color previo y objetivo final para
            elegir la mejor tecnica.
          </p>
        </article>
        <article class="redo-value-card">
          <h3>Color y cuidado</h3>
          <p>
            Buscamos resultados prolijos, luminosos y sostenibles en el tiempo, con foco en la
            salud capilar y en el mantenimiento en casa.
          </p>
        </article>
        <article class="redo-value-card">
          <h3>Reserva simple</h3>
          <p>
            La agenda online muestra disponibilidad real y permite continuar la confirmacion por
            WhatsApp de forma directa.
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
              placeholder="Contanos si queres color, brushing, un cambio de look o algun detalle importante"
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
            <li v-for="service in footerServices" :key="service.slug">{{ service.name }}</li>
          </ul>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "../utils/api.js";
import { studioInfo } from "../../shared/site.js";
import redoAbout from "../assets/redo-about.png";
import redoBanner from "../assets/redo-banner.png";
import redoLogo from "../assets/redo-logo.png";

const serviceImageMap = {
  "corte-signature": "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "barba-premium": "https://images.pexels.com/photos/7697390/pexels-photo-7697390.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "combo-completo": "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "brushing-pro": "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "tintura-global": "https://images.pexels.com/photos/3993304/pexels-photo-3993304.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "balayage-soft": redoAbout,
  "nutricion-capilar": "https://images.pexels.com/photos/4620843/pexels-photo-4620843.jpeg?auto=compress&cs=tinysrgb&w=1200",
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

const serviceCards = computed(() =>
  services.value.map((service) => ({
    ...service,
    image: serviceImageMap[service.slug] || redoAbout,
  }))
);

const footerServices = computed(() => services.value.slice(0, 6));

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
    const selectedService = services.value.find((item) => item.slug === payload.serviceSlug);
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
