export const siteConfig = {
  name: "REDO",
  description:
    "Barberia y peluqueria premium con reservas online, identidad moderna y experiencia orientada al detalle.",
  tagline: "Precision grooming. Real confidence.",
  location: "Palermo, Buenos Aires",
  phone: "+54 11 5555 0101",
  email: "hola@redostudio.com",
  hours: [
    "Lunes a viernes · 10:00 a 20:00",
    "Sabados · 10:00 a 19:00",
    "Domingos · Cerrado",
  ],
} as const;

export const featuredServices = [
  {
    name: "Signature Cut",
    description:
      "Corte personalizado con asesoria de estilo, lavado y acabado profesional.",
    durationMinutes: 45,
    duration: "45 min",
    price: "$18.000",
  },
  {
    name: "Beard Design",
    description:
      "Perfilado tecnico de barba, navaja de precision y tratamiento calmante.",
    durationMinutes: 30,
    duration: "30 min",
    price: "$12.000",
  },
  {
    name: "Full Redo Experience",
    description:
      "Corte, barba, toalla caliente y puesta a punto completa para una imagen impecable.",
    durationMinutes: 75,
    duration: "75 min",
    price: "$27.000",
  },
] as const;

export const stylists = [
  {
    name: "Matias Costa",
    role: "Senior Barber",
    specialty: "Fade, textura y perfilado clasico.",
  },
  {
    name: "Julian Ferrero",
    role: "Hair Stylist",
    specialty: "Cortes modernos y asesoramiento de imagen.",
  },
  {
    name: "Agustin Leon",
    role: "Grooming Specialist",
    specialty: "Barba, cuidado premium y acabados de precision.",
  },
] as const;

export const experienceHighlights = [
  "Reserva online con confirmacion simple y rapida.",
  "Servicios pensados para clientes que valoran imagen y tiempo.",
  "Panel admin preparado para gestionar turnos, servicios y equipo.",
] as const;

export const metrics = [
  { value: "12h", label: "respuesta maxima a solicitudes" },
  { value: "4.9/5", label: "satisfaccion estimada de clientes" },
  { value: "3", label: "especialistas con foco en estilo masculino" },
] as const;

export const roadmap = {
  mvp: [
    "Landing comercial con propuesta de valor clara y diseño premium.",
    "Catalogo de servicios destacado con precios, duracion y beneficios.",
    "Formulario de solicitud de turno persistido en base de datos.",
    "API inicial para reservas y chequeo de estado.",
    "Base lista para panel administrativo y autenticacion.",
  ],
  next: [
    "Autenticacion para staff y panel admin protegido.",
    "Calendario real con estados de turnos y disponibilidad.",
    "Galeria de trabajos y testimonios gestionables.",
    "Recordatorios por email o WhatsApp.",
    "Metricas basicas de ocupacion y servicios mas pedidos.",
  ],
} as const;

export const weeklyAvailability = {
  1: { startHour: 10, endHour: 20 },
  2: { startHour: 10, endHour: 20 },
  3: { startHour: 10, endHour: 20 },
  4: { startHour: 10, endHour: 20 },
  5: { startHour: 10, endHour: 20 },
  6: { startHour: 10, endHour: 19 },
} as const;
