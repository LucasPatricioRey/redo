export const studioInfo = {
  name: "REDO",
  city: "Buenos Aires",
  address: "Bolanos 229, Floresta",
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
    slug: "corte",
    name: "Corte",
    description: "Cortes personalizados con terminacion prolija y asesoramiento segun tu estilo y textura.",
    duration: 60,
    price: 18000,
  },
  {
    slug: "balayage",
    name: "Balayage",
    description: "Iluminacion degradada con efecto natural, brillo suave y movimiento en largos y medios.",
    duration: 180,
    price: 68000,
  },
  {
    slug: "color",
    name: "Color",
    description: "Coloracion global o retoque de raiz con diagnostico previo para un tono uniforme y luminoso.",
    duration: 120,
    price: 42000,
  },
  {
    slug: "mechas",
    name: "Mechas",
    description: "Tecnica de iluminacion precisa para sumar contraste, luz y definicion sin perder naturalidad.",
    duration: 150,
    price: 52000,
  },
  {
    slug: "brushing",
    name: "Brushing",
    description: "Peinado con brushing para dar forma, brillo y terminacion pulida segun el estilo buscado.",
    duration: 50,
    price: 16000,
  },
  {
    slug: "ondas",
    name: "Ondas",
    description: "Ondas suaves y definidas para sumar textura, movimiento y un acabado relajado pero elegante.",
    duration: 55,
    price: 17000,
  },
  {
    slug: "peinados-especiales",
    name: "Peinados especiales",
    description: "Recogidos y peinados de evento con detalles personalizados para noches, fiestas o bodas.",
    duration: 90,
    price: 26000,
  },
  {
    slug: "manicuria",
    name: "Manicuria",
    description: "Manos cuidadas con limado, prolijado de cuticulas y esmaltado elegante para todos los dias.",
    duration: 45,
    price: 14000,
  },
];

export const barbers = [
  {
    slug: "bruno",
    name: "Bruno Mena",
    role: "Director creativo",
    specialties: ["cortes", "brushing", "asesoramiento de imagen"],
  },
  {
    slug: "nicolas",
    name: "Nicolas Rey",
    role: "Colorista senior",
    specialties: ["balayage", "mechas", "coloracion"],
  },
  {
    slug: "mati",
    name: "Matias Costa",
    role: "Stylist",
    specialties: ["ondas", "peinados especiales", "acabados"],
  },
];
