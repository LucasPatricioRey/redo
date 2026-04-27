import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  createBooking,
  getBookings,
  getBookingsByDate,
  updateBookingStatus,
} from "../server/booking-repository.js";
import { buildAvailableSlots } from "../server/availability-service.js";
import {
  clearAdminSession,
  createAdminSession,
  readAdminSession,
  requireAdmin,
} from "../server/admin-auth.js";
import { barbers, services } from "../shared/site.js";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

const app = express();
const adminUsername = process.env.ADMIN_USERNAME || "lucas";
const adminPassword = process.env.ADMIN_PASSWORD || "RedoAdmin2026!";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", async (_request, response) => {
  response.json({ status: "ok", service: "redo-api" });
});

app.get("/api/availability", async (request, response) => {
  const { date, barberSlug, serviceSlug } = request.query;

  if (!date || !barberSlug || !serviceSlug) {
    response.status(400).json({ message: "Faltan parametros para consultar disponibilidad" });
    return;
  }

  const bookings = await getBookingsByDate(String(date));
  const slots = buildAvailableSlots({
    date: String(date),
    barberSlug: String(barberSlug),
    serviceSlug: String(serviceSlug),
    bookings,
  });

  response.json({ slots });
});

app.post("/api/bookings", async (request, response) => {
  const customerName = String(request.body.customerName || "").trim();
  const customerPhone = String(request.body.customerPhone || "").trim();
  const serviceSlug = String(request.body.serviceSlug || "").trim();
  const barberSlug = String(request.body.barberSlug || "").trim();
  const date = String(request.body.date || "").trim();
  const time = String(request.body.time || "").trim();
  const notes = String(request.body.notes || "").trim();

  if (!customerName || !customerPhone || !serviceSlug || !barberSlug || !date || !time) {
    response.status(400).json({ message: "Completa todos los campos obligatorios" });
    return;
  }

  if (customerPhone.replace(/\D/g, "").length < 8) {
    response.status(400).json({ message: "Ingresa un telefono valido" });
    return;
  }

  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    response.status(400).json({ message: "No se pueden reservar fechas pasadas" });
    return;
  }

  const service = services.find((item) => item.slug === serviceSlug);
  const barber = barbers.find((item) => item.slug === barberSlug);

  if (!service || !barber) {
    response.status(400).json({ message: "Servicio o profesional no valido" });
    return;
  }

  const bookings = await getBookingsByDate(date);
  const availableSlots = buildAvailableSlots({
    date,
    barberSlug,
    serviceSlug,
    bookings,
  });

  if (!availableSlots.includes(time)) {
    response.status(409).json({ message: "Ese horario ya no esta disponible" });
    return;
  }

  const booking = await createBooking({
    customerName,
    customerPhone,
    serviceSlug,
    serviceName: service.name,
    serviceDuration: service.duration,
    barberSlug,
    barberName: barber.name,
    date,
    time,
    notes: notes || "",
  });

  response.status(201).json({
    message: "Reserva recibida correctamente",
    bookingId: booking._id,
  });
});

app.post("/api/admin/login", (request, response) => {
  const { username, password } = request.body;

  if (username !== adminUsername || password !== adminPassword) {
    response.status(401).json({ message: "Credenciales invalidas" });
    return;
  }

  createAdminSession(response);
  response.json({ message: "Sesion iniciada" });
});

app.post("/api/admin/logout", (_request, response) => {
  clearAdminSession(response);
  response.json({ message: "Sesion cerrada" });
});

app.get("/api/admin/session", (request, response) => {
  const session = readAdminSession(request);
  response.json({ authenticated: Boolean(session) });
});

app.get("/api/admin/bookings", requireAdmin, async (request, response) => {
  const bookings = await getBookings({
    status: String(request.query.status || "todos"),
    search: String(request.query.search || "").trim(),
  });

  response.json({ bookings });
});

app.patch("/api/admin/bookings/:id/status", requireAdmin, async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  if (!["pendiente", "confirmado", "cancelado"].includes(status)) {
    response.status(400).json({ message: "Estado invalido" });
    return;
  }

  const booking = await updateBookingStatus(id, status);

  if (!booking) {
    response.status(404).json({ message: "Reserva no encontrada" });
    return;
  }

  response.json({ booking });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Ocurrio un error interno" });
});

export default app;
