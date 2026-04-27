export const studioInfo = {
  name: "REDO Studio",
  city: "Buenos Aires",
  address: "Honduras 4872, Palermo",
  phone: "+54 11 3928 2201",
  schedule: {
    monday: { enabled: true, open: "10:00", close: "20:00" },
    tuesday: { enabled: true, open: "10:00", close: "20:00" },
    wednesday: { enabled: true, open: "10:00", close: "20:00" },
    thursday: { enabled: true, open: "10:00", close: "20:00" },
    friday: { enabled: true, open: "10:00", close: "20:00" },
    saturday: { enabled: true, open: "10:00", close: "18:00" },
    sunday: { enabled: false, open: "", close: "" },
  },
};

export const services = [
  {
    slug: "corte-signature",
    name: "Corte Signature",
    description: "Corte personalizado con asesoramiento de estilo y terminacion precisa.",
    duration: 60,
    price: 18000,
  },
  {
    slug: "barba-premium",
    name: "Barba Premium",
    description: "Perfilado, toalla caliente y definicion pensada para cada tipo de rostro.",
    duration: 45,
    price: 14000,
  },
  {
    slug: "combo-completo",
    name: "Combo Completo",
    description: "Corte, barba y terminaciones para quienes buscan una puesta a punto integral.",
    duration: 90,
    price: 26000,
  },
];

export const barbers = [
  {
    slug: "bruno",
    name: "Bruno Mena",
    role: "Director creativo",
    specialties: ["cortes clasicos", "fade", "consultoria de imagen"],
  },
  {
    slug: "nicolas",
    name: "Nicolas Rey",
    role: "Barbero senior",
    specialties: ["barba", "texturas", "acabados premium"],
  },
  {
    slug: "mati",
    name: "Matias Costa",
    role: "Stylist",
    specialties: ["corte moderno", "asesoramiento", "tendencias urbanas"],
  },
];
