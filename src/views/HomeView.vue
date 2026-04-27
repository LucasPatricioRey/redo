<template>
  <main class="page-shell page-shell--home page-shell--salon">
    <section class="salon-hero">
      <div class="salon-hero__copy">
        <p class="eyebrow">Salon unisex en Floresta</p>
        <div class="salon-hero__brand">
          <span>REDO</span>
          <small>Corte, color y bienestar capilar</small>
        </div>
        <h1>Una peluqueria luminosa, actual y pensada para verse bien desde el primer turno.</h1>
        <p class="salon-hero__lead">
          REDO combina corte, color, brushing y tratamientos en una propuesta simple de entender,
          cercana y profesional. La experiencia arranca online, pero se siente como un salon real.
        </p>
        <div class="salon-hero__meta">
          <span>{{ studioInfo.address }}</span>
          <span>{{ studioInfo.phone }}</span>
          <span>Lunes a sabado con agenda activa</span>
        </div>
        <div class="salon-hero__actions">
          <a class="primary-link" href="#reserva">Reservar turno</a>
          <a class="secondary-link" href="#servicios">Ver servicios</a>
        </div>
      </div>

      <div class="salon-hero__visual">
        <div class="salon-hero__carousel">
          <transition name="fade-slide" mode="out-in">
            <img
              :key="activeSlide.image"
              :src="activeSlide.image"
              :alt="activeSlide.title"
              class="salon-hero__carousel-image"
            />
          </transition>
          <div class="salon-hero__carousel-card">
            <p class="eyebrow">{{ activeSlide.eyebrow }}</p>
            <h2>{{ activeSlide.title }}</h2>
            <p>{{ activeSlide.description }}</p>
          </div>
        </div>

        <div class="salon-hero__controls">
          <button class="ghost-button" type="button" @click="previousSlide">Anterior</button>
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
          <button class="ghost-button" type="button" @click="nextSlide">Siguiente</button>
        </div>
      </div>
    </section>

    <section class="salon-strip">
      <article v-for="item in heroHighlights" :key="item.title" class="salon-strip__item">
        <span>{{ item.label }}</span>
        <strong>{{ item.title }}</strong>
        <p>{{ item.description }}</p>
      </article>
    </section>

    <section id="servicios" class="salon-story">
      <article class="salon-story__copy content-card content-card--light">
        <p class="eyebrow">La propuesta</p>
        <h2>Un espacio unisex con foco en imagen, comodidad y resultados prolijos.</h2>
        <p>
          La idea de REDO es sentirse más cerca de una peluqueria de barrio bien resuelta que de
          una barberia conceptual. Corte, color y cuidado capilar conviven en una carta clara y
          adaptable para distintos estilos.
        </p>
      </article>

      <div class="salon-story__gallery">
        <img
          src="https://images.pexels.com/photos/7755540/pexels-photo-7755540.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Salon de peluqueria luminoso"
        />
        <img
          src="https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Herramientas de peluqueria"
        />
      </div>
    </section>

    <section class="content-grid content-grid--salon">
      <article class="content-card content-card--light">
        <p class="eyebrow">Servicios</p>
        <h2>Corte, color y tratamientos para una propuesta realmente unisex.</h2>
        <p class="section-helper">
          Cada servicio busca reflejar una peluqueria actual: más abierta, más clara y con espacio
          para corte clásico, color y cambios de look.
        </p>
        <p v-if="catalogLoading">Cargando servicios...</p>
        <div v-else class="service-list service-list--cards">
          <div v-for="service in services" :key="service.slug" class="service-item service-item--card">
            <div class="service-item__topline">
              <h3>{{ service.name }}</h3>
              <strong>${{ Number(service.price).toLocaleString("es-AR") }}</strong>
            </div>
            <p>{{ service.description }}</p>
            <span class="service-item__hint">{{ service.duration }} min aproximados</span>
          </div>
        </div>
      </article>

      <article class="content-card content-card--light content-card--accent-soft">
        <p class="eyebrow">Equipo</p>
        <h2>Perfiles definidos para corte, color y atencion personalizada.</h2>
        <p class="section-helper">
          Un equipo chico y entendible ayuda a que la reserva online se sienta confiable y no una
          caja negra.
        </p>
        <p v-if="catalogLoading">Cargando profesionales...</p>
        <div v-else class="team-list team-list--stack">
          <div v-for="barber in barbers" :key="barber.slug" class="team-item team-item--salon">
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

    <section class="mosaic-grid">
      <div v-for="image in galleryImages" :key="image.src" class="mosaic-grid__item">
        <img :src="image.src" :alt="image.alt" />
      </div>
    </section>

    <section id="reserva" class="booking-layout booking-layout--salon">
      <article class="content-card content-card--light booking-card booking-card--salon">
        <div class="booking-card__head booking-card__head--salon">
          <div>
            <p class="eyebrow">Reserva online</p>
            <h2>Solicitar turno</h2>
          </div>
          <span class="booking-card__chip booking-card__chip--light">Disponibilidad real</span>
        </div>

        <form class="booking-form booking-form--light" @submit.prevent="submitBooking">
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
              placeholder="Ejemplo: me gustaria un cambio de look, cubrir canas o un brushing con movimiento"
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

        <div v-if="reservationSummary" class="success-card success-card--light">
          <p class="eyebrow">Reserva enviada</p>
          <h3>Solicitud recibida correctamente</h3>
          <p class="form-success">{{ successMessage }}</p>
          <div class="success-card__grid">
            <span>Servicio: <strong>{{ reservationSummary.serviceName }}</strong></span>
            <span>Profesional: <strong>{{ reservationSummary.barberName }}</strong></span>
            <span>Fecha: <strong>{{ reservationSummary.date }}</strong></span>
            <span>Horario: <strong>{{ reservationSummary.time }}</strong></span>
          </div>
          <a class="primary-link" :href="whatsappLink" target="_blank" rel="noreferrer">
            Confirmar por WhatsApp
          </a>
        </div>
      </article>

      <aside class="content-card content-card--light content-card--quote">
        <p class="eyebrow">Experiencia REDO</p>
        <h2>Una fachada más cercana a un salon real y menos a una landing genérica.</h2>
        <p class="section-helper">
          Mientras después sumemos fotos propias, esta selección visual ya empuja a REDO hacia un
          tono más claro, más beauty y más unisex.
        </p>
        <div class="quote-panel">
          <strong>“Color, corte y bienestar capilar en un mismo lugar.”</strong>
          <span>Atencion con reserva online y confirmacion por WhatsApp.</span>
        </div>
        <div class="ambiance-card__stack ambiance-card__stack--salon">
          <img
            src="https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Salon con espejos"
          />
          <img
            src="https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Trabajo de coloracion"
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
    eyebrow: "Imagen de salon",
    title: "Luz natural y una primera impresion mas calida",
    description: "REDO se mueve hacia una estetica mas clara, premium y unisex, inspirada en salones reales.",
    image: "https://images.pexels.com/photos/7755540/pexels-photo-7755540.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Pelo y movimiento",
    title: "Color, brushing y cambios de look con protagonismo real",
    description: "La home ahora vende mejor la idea de peluqueria unisex y no solo de barberia.",
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Ambiente",
    title: "Un salon prolijo, suave y mas cercano a una marca propia",
    description: "La combinacion de tipografia, aire y fotografia apunta a una identidad mas memorable.",
    image: "https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    eyebrow: "Detalle",
    title: "Cuidado capilar, herramientas y una experiencia mas completa",
    description: "La marca se abre a corte, color y tratamiento, con una fachada mas realista.",
    image: "https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const heroHighlights = [
  {
    label: "Corte y color",
    title: "Servicios para distintos estilos y edades",
    description: "La propuesta se siente unisex desde el inicio y no solo en la lista de servicios.",
  },
  {
    label: "Reserva real",
    title: "Agenda activa segun profesional, fecha y horario",
    description: "El formulario sigue conectado a disponibilidad real y confirmacion por WhatsApp.",
  },
  {
    label: "Salon actual",
    title: "Una imagen mas clara, editorial y confiable",
    description: "Más aire, más luz y más identidad visual para que REDO se vea mas profesional.",
  },
];

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/3993304/pexels-photo-3993304.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Aplicacion de tintura en peluqueria",
  },
  {
    src: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Mujer peinandose en salon",
  },
  {
    src: "https://images.pexels.com/photos/4620843/pexels-photo-4620843.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Lavado de cabello en peluqueria",
  },
  {
    src: "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Corte de cabello en interior luminoso",
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
  }, 4800);
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
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>
