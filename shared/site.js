export const studioInfo = {
  name: "REDO",
  city: "Buenos Aires",
  address: "Bolaños 229, Floresta",
  phone: "+54 9 11 5409 7209",
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
    name: "Corte de diseño",
    description: "Corte personalizado con asesoramiento de estilo y terminacion precisa.",
    duration: 60,
    price: 18000,
  },
  {
    slug: "barba-premium",
    name: "Barba y perfilado",
    description: "Perfilado, toalla caliente y definicion pensada para cada tipo de rostro.",
    duration: 45,
    price: 14000,
  },
  {
    slug: "combo-completo",
    name: "Combo corte y barba",
    description: "Corte, barba y terminaciones para quienes buscan una puesta a punto integral.",
    duration: 90,
    price: 26000,
  },
  {
    slug: "brushing-pro",
    name: "Brushing profesional",
    description: "Peinado con brushing para dar forma, brillo y terminacion prolija.",
    duration: 50,
    price: 16000,
  },
  {
    slug: "tintura-global",
    name: "Tintura global",
    description: "Coloracion completa con diagnostico previo y definicion de tono.",
    duration: 120,
    price: 42000,
  },
  {
    slug: "balayage-soft",
    name: "Balayage soft",
    description: "Iluminacion suave para aportar contraste y movimiento con acabado natural.",
    duration: 180,
    price: 68000,
  },
  {
    slug: "nutricion-capilar",
    name: "Nutricion capilar",
    description: "Tratamiento de hidratacion profunda para recuperar textura y brillo.",
    duration: 55,
    price: 22000,
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
