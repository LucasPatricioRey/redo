<template>
  <main class="page-shell page-shell--home">
    <section class="hero hero--showcase">
      <div class="hero__copy">
        <div class="hero__brand-mark">
          <span>REDO</span>
          <small>Corte, color y estilo</small>
        </div>
        <p class="eyebrow">Peluqueria y barberia unisex</p>
        <h1>REDO</h1>
        <p class="hero__lead">
          Una peluqueria unisex con mirada actual: cortes limpios, color, tratamientos y reservas
          claras para que la experiencia sea simple, prolija y real desde el primer clic.
        </p>
        <div class="hero__meta hero__meta--stack">
          <span>{{ studioInfo.address }}</span>
          <span>{{ studioInfo.phone }}</span>
          <span>Agenda activa de lunes a sabado</span>
        </div>
        <div class="hero__actions">
          <a class="hero__link" href="#reserva">Reservar ahora</a>
          <span class="hero__note">Estetica unisex con agenda online y confirmacion por WhatsApp.</span>
        </div>
      </div>

      <div class="showcase-panel">
        <div class="showcase-panel__frame">
          <transition name="fade-slide" mode="out-in">
            <img
              :key="activeSlide.image"
              :src="activeSlide.image"
              :alt="activeSlide.title"
              class="showcase-panel__image"
            />
          </transition>
          <div class="showcase-panel__overlay">
            <p class="showcase-panel__eyebrow">{{ activeSlide.eyebrow }}</p>
            <h2>{{ activeSlide.title }}</h2>
            <p>{{ activeSlide.description }}</p>
          </div>
        </div>

        <div class="showcase-panel__controls">
          <button class="carousel-button" type="button" @click="previousSlide">Anterior</button>
          <div class="carousel-dots">
            <button
              v-for="(slide, index) in slides"
              :key="slide.image"
              class="carousel-dot"
              :class="{ 'carousel-dot--active': index === activeSlideIndex }"
              type="button"
              @click="setSlide(index)"
            ></button>
          </div>
          <button class="carousel-button" type="button" @click="nextSlide">Siguiente</button>
        </div>
      </div>
    </section>

    <section class="feature-strip">
      <article class="feature-strip__item feature-strip__item--accent">
        <span>Marca REDO</span>
        <strong>Imagen urbana, agenda prolija y experiencia directa</strong>
      </article>
      <article class="feature-strip__item">
        <span>Servicios unisex</span>
        <strong>Corte, color, brushing y tratamientos</strong>
      </article>
      <article class="feature-strip__item">
        <span>Reserva moderna</span>
        <strong>Turnos reales con confirmacion por WhatsApp</strong>
      </article>
    </section>

    <section class="content-grid content-grid--home">
      <article class="content-card content-card--spotlight">
        <p class="eyebrow">Servicios</p>
        <h2>Una carta pensada para un publico mas amplio</h2>
        <p class="section-helper">
          REDO combina barberia, peluqueria y color en una sola propuesta. La idea es que la
          fachada ya se sienta usable para un negocio real y no solo como una demo.
        </p>
        <p v-if="catalogLoading">Cargando servicios...</p>
        <div v-else class="service-list">
          <div v-for="service in services" :key="service.slug" class="service-item service-item--visual">
            <div>
              <h3>{{ service.name }}</h3>
              <p>{{ service.description }}</p>
            </div>
            <div class="service-item__meta service-item__meta--accent">
              <span>{{ service.duration }} min</span>
              <strong>${{ Number(service.price).toLocaleString("es-AR") }}</strong>
            </div>
          </div>
        </div>
      </article>

      <article class="content-card content-card--team">
        <p class="eyebrow">Equipo</p>
        <h2>Perfiles definidos, look contemporaneo</h2>
        <p class="section-helper">
          Un equipo chico y claro, con especialidades que le dan sentido a la reserva online y al
          tono visual general del sitio.
        </p>
        <p v-if="catalogLoading">Cargando profesionales...</p>
        <div v-else class="team-list">
          <div v-for="barber in barbers" :key="barber.slug" class="team-item team-item--visual">
            <div class="team-item__badge">{{ barber.name.charAt(0) }}</div>
            <div>
              <h3>{{ barber.name }}</h3>
              <p>{{ barber.role }}</p>
              <small>{{ (barber.specialties || []).join(" - ") }}</small>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="gallery-band">
      <div v-for="image in galleryImages" :key="image.src" class="gallery-band__item">
        <img :src="image.src" :alt="image.alt" />
      </div>
    </section>

    <section id="reserva" class="booking-layout booking-layout--home">
      <article class="content-card booking-card booking-card--featured">
        <div class="booking-card__head">
          <div>
            <p class="eyebrow">Reserva online</p>
            <h2>Solicitar turno</h2>
          </div>
          <span class="booking-card__chip">Agenda en tiempo real</span>
        </div>

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
              placeholder="Ejemplo: primera visita, cambio de look o preferencia de estilo"
            ></textarea>
          </label>

          <div class="booking-card__footer">
            <div class="booking-card__messages">
              <p v-if="slotsMessage" class="form-helper">{{ slotsMessage }}</p>
              <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
            </div>
            <button :disabled="submitting || catalogLoading" type="submit">
              {{ submitting ? "Enviando reserva..." : "Confirmar solicitud" }}
            </button>
          </div>
        </form>

        <div v-if="reservationSummary" class="success-card">
          <p class="eyebrow">Reserva enviada</p>
          <h3>Solicitud recibida correctamente</h3>
          <p class="form-success">{{ successMessage }}</p>
          <div class="success-card__grid">
            <span>Servicio: <strong>{{ reservationSummary.serviceName }}</strong></span>
            <span>Profesional: <strong>{{ reservationSummary.barberName }}</strong></span>
            <span>Fecha: <strong>{{ reservationSummary.date }}</strong></span>
            <span>Horario: <strong>{{ reservationSummary.time }}</strong></span>
          </div>
          <a class="hero__link" :href="whatsappLink" target="_blank" rel="noreferrer">
            Confirmar por WhatsApp
          </a>
        </div>
      </article>

      <aside class="content-card ambiance-card">
        <p class="eyebrow">Fachada visual</p>
        <h2>Mas imagenes para vender mejor el concepto</h2>
        <p class="section-helper">
          Estas imagenes siguen siendo de apoyo, pero ahora construyen una fachada mas completa para
          REDO mientras despues definimos fotos reales del local.
        </p>
        <div class="ambiance-card__stack ambiance-card__stack--grid">
          <img
            src="https://images.pexels.com/photos/19225277/pexels-photo-19225277.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Sillon de barberia moderno"
          />
          <img
            src="https://images.pexels.com/photos/7518689/pexels-photo-7518689.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Cliente en peluqueria"
          />
          <img
            src="https://images.pexels.com/photos/9341769/pexels-photo-9341769.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Trabajo de barberia"
          />
          <img
            src="https://images.pexels.com/photos/18483780/pexels-photo-18483780.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Silla de peluqueria"
          />
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { api } from "../utils/api.js";
import { studioInfo } from "../../shared/site.js";

const slides = [
  {
    eyebrow: "Pexels",
    title: "Textura, luz y caracter",
    description: "Una portada mas urbana y visual para que REDO empiece a sentirse como una marca propia.",
    image: "https://images.pexels.com/photos/19225277/pexels-photo-19225277.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Pexels",
    title: "Color y movimiento",
    description: "El lado peluqueria de REDO tambien entra en escena: color, estilo y cambio de look.",
    image: "https://images.pexels.com/photos/18483780/pexels-photo-18483780.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Pexels",
    title: "Precision de corte",
    description: "Una imagen mas cercana al oficio para que la experiencia no sea solo decorativa.",
    image: "https://images.pexels.com/photos/14011984/pexels-photo-14011984.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Pexels",
    title: "Cliente y experiencia",
    description: "La escena humana aporta una vibra mas real y menos showroom.",
    image: "https://images.pexels.com/photos/7518689/pexels-photo-7518689.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Pexels",
    title: "Atmosfera de estudio",
    description: "Un cierre visual mas editorial para que REDO tenga mas presencia de marca.",
    image: "https://images.pexels.com/photos/9341769/pexels-photo-9341769.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/4625616/pexels-photo-4625616.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Cliente en silla de barberia",
  },
  {
    src: "https://images.pexels.com/photos/7518687/pexels-photo-7518687.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Interior de barberia con espejo",
  },
  {
    src: "https://images.pexels.com/photos/14011984/pexels-photo-14011984.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Trabajo de corte",
  },
];

const activeSlideIndex = ref(0);
let carouselInterval = null;

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
const reservationSummary = ref(null);
const resettingAfterSubmit = ref(false);
const slotsMessage = ref("Selecciona servicio, profesional y fecha para ver horarios reales.");

const activeSlide = computed(() => slides[activeSlideIndex.value]);

const minimumDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const whatsappLink = computed(() => {
  if (!reservationSummary.value) {
    return "#";
  }

  const phone = studioInfo.phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hola REDO, envie una reserva para ${reservationSummary.value.serviceName} con ${reservationSummary.value.barberName} el ${reservationSummary.value.date} a las ${reservationSummary.value.time}.`
  );

  return `https://wa.me/${phone}?text=${message}`;
});

function setSlide(index) {
  activeSlideIndex.value = index;
}

function nextSlide() {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.length;
}

function previousSlide() {
  activeSlideIndex.value = (activeSlideIndex.value - 1 + slides.length) % slides.length;
}

function startCarousel() {
  carouselInterval = window.setInterval(() => {
    nextSlide();
  }, 4500);
}

function stopCarousel() {
  if (carouselInterval) {
    window.clearInterval(carouselInterval);
  }
}

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
    const selectedService = services.value.find((item) => item.slug === payload.serviceSlug);
    const selectedBarber = barbers.value.find((item) => item.slug === payload.barberSlug);

    const { data } = await api.post("/bookings", payload);
    successMessage.value = `${data.message} Ahora ya tenes una confirmacion visible del turno solicitado.`;
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
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>
