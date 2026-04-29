import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "../server/env.js";
import {
  deleteBarber,
  deleteBlock,
  deleteService,
  getBlocks,
  getCatalog,
  saveBarber,
  saveBlock,
  saveSchedule,
  saveService,
} from "../server/catalog-repository.js";
import {
  createBooking,
  deleteBooking,
  getBookings,
  getBookingsByDate,
  updateBooking,
  updateBookingStatus,
} from "../server/booking-repository.js";
import { buildAvailableSlots } from "../server/availability-service.js";
import {
  clearAdminSession,
  createAdminSession,
  readAdminSession,
  requireAdmin,
} from "../server/admin-auth.js";

const app = express();

function sanitizeBookingPayload(body) {
  return {
    customerName: String(body.customerName || "").trim(),
    customerPhone: String(body.customerPhone || "").trim(),
    serviceSlug: String(body.serviceSlug || "").trim(),
    barberSlug: String(body.barberSlug || "").trim(),
    date: String(body.date || "").trim(),
    time: String(body.time || "").trim(),
    notes: String(body.notes || "").trim(),
  };
}

async function buildBookingPayload(payload) {
  const catalog = await getCatalog();
  const service = catalog.services.find((item) => item.slug === payload.serviceSlug);
  const barber = catalog.barbers.find((item) => item.slug === payload.barberSlug);

  return {
    catalog,
    service,
    barber,
    booking: {
      ...payload,
      serviceName: service?.name,
      serviceDuration: service?.duration,
      barberName: barber?.name,
    },
  };
}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "redo-api" });
});

app.get("/api/catalog", async (_request, response) => {
  response.json(await getCatalog());
});

app.get("/api/availability", async (request, response) => {
  const { date, barberSlug, serviceSlug } = request.query;

  if (!date || !barberSlug || !serviceSlug) {
    response.status(400).json({ message: "Faltan parametros para consultar disponibilidad" });
    return;
  }

  const catalog = await getCatalog();
  const [bookings, blocks] = await Promise.all([
    getBookingsByDate(String(date)),
    getBlocks(String(date)),
  ]);

  const slots = buildAvailableSlots({
    date: String(date),
    barberSlug: String(barberSlug),
    serviceSlug: String(serviceSlug),
    bookings,
    blocks,
    schedule: catalog.schedule,
    catalogServices: catalog.services,
    catalogBarbers: catalog.barbers,
  });

  response.json({ slots });
});

app.post("/api/bookings", async (request, response) => {
  const payload = sanitizeBookingPayload(request.body);

  if (
    !payload.customerName ||
    !payload.customerPhone ||
    !payload.serviceSlug ||
    !payload.barberSlug ||
    !payload.date ||
    !payload.time
  ) {
    response.status(400).json({ message: "Completa todos los campos obligatorios" });
    return;
  }

  if (payload.customerPhone.replace(/\D/g, "").length < 8) {
    response.status(400).json({ message: "Ingresa un telefono valido" });
    return;
  }

  const selectedDate = new Date(`${payload.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    response.status(400).json({ message: "No se pueden reservar fechas pasadas" });
    return;
  }

  const prepared = await buildBookingPayload(payload);

  if (!prepared.service || !prepared.barber) {
    response.status(400).json({ message: "Servicio o profesional no valido" });
    return;
  }

  const [bookings, blocks] = await Promise.all([
    getBookingsByDate(payload.date),
    getBlocks(payload.date),
  ]);

  const availableSlots = buildAvailableSlots({
    date: payload.date,
    barberSlug: payload.barberSlug,
    serviceSlug: payload.serviceSlug,
    bookings,
    blocks,
    schedule: prepared.catalog.schedule,
    catalogServices: prepared.catalog.services,
    catalogBarbers: prepared.catalog.barbers,
  });

  if (!availableSlots.includes(payload.time)) {
    response.status(409).json({ message: "Ese horario ya no esta disponible" });
    return;
  }

  const booking = await createBooking(prepared.booking);

  response.status(201).json({
    message: "Reserva recibida correctamente",
    bookingId: booking._id,
  });
});

app.post("/api/admin/login", async (request, response) => {
  const { username, password } = request.body;

  if (username !== env.adminUsername || password !== env.adminPassword) {
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
  response.json({
    bookings: await getBookings({
      status: String(request.query.status || "todos"),
      search: String(request.query.search || "").trim(),
    }),
  });
});

app.patch("/api/admin/bookings", requireAdmin, async (request, response) => {
  const { id, mode = "status", status } = request.body;

  if (!id) {
    response.status(400).json({ message: "Falta el identificador de la reserva" });
    return;
  }

  if (mode === "status") {
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
    return;
  }

  const payload = sanitizeBookingPayload(request.body);

  if (payload.customerPhone.replace(/\D/g, "").length < 8) {
    response.status(400).json({ message: "Ingresa un telefono valido" });
    return;
  }

  const prepared = await buildBookingPayload(payload);

  if (!prepared.service || !prepared.barber) {
    response.status(400).json({ message: "Servicio o profesional no valido" });
    return;
  }

  const bookings = (await getBookingsByDate(payload.date)).filter((item) => item._id.toString() !== id);
  const blocks = await getBlocks(payload.date);
  const availableSlots = buildAvailableSlots({
    date: payload.date,
    barberSlug: payload.barberSlug,
    serviceSlug: payload.serviceSlug,
    bookings,
    blocks,
    schedule: prepared.catalog.schedule,
    catalogServices: prepared.catalog.services,
    catalogBarbers: prepared.catalog.barbers,
  });

  if (!availableSlots.includes(payload.time)) {
    response.status(409).json({ message: "Ese horario ya no esta disponible" });
    return;
  }

  const booking = await updateBooking(id, prepared.booking);
  response.json({ booking });
});

app.delete("/api/admin/bookings", requireAdmin, async (request, response) => {
  const id = String(request.query.id || "");

  if (!id) {
    response.status(400).json({ message: "Falta el identificador de la reserva" });
    return;
  }

  await deleteBooking(id);
  response.json({ message: "Reserva eliminada" });
});

app.get("/api/admin/services", requireAdmin, async (_request, response) => {
  const catalog = await getCatalog();
  response.json({ services: catalog.services });
});

app.post("/api/admin/services", requireAdmin, async (request, response) => {
  response.status(201).json({ service: await saveService(request.body) });
});

app.put("/api/admin/services", requireAdmin, async (request, response) => {
  response.json({ service: await saveService(request.body) });
});

app.delete("/api/admin/services", requireAdmin, async (request, response) => {
  const id = String(request.query.id || "");

  if (!id) {
    response.status(400).json({ message: "Falta el identificador del servicio" });
    return;
  }

  await deleteService(id);
  response.json({ message: "Servicio eliminado" });
});

app.get("/api/admin/barbers", requireAdmin, async (_request, response) => {
  const catalog = await getCatalog();
  response.json({ barbers: catalog.barbers });
});

app.post("/api/admin/barbers", requireAdmin, async (request, response) => {
  response.status(201).json({ barber: await saveBarber(request.body) });
});

app.put("/api/admin/barbers", requireAdmin, async (request, response) => {
  response.json({ barber: await saveBarber(request.body) });
});

app.delete("/api/admin/barbers", requireAdmin, async (request, response) => {
  const id = String(request.query.id || "");

  if (!id) {
    response.status(400).json({ message: "Falta el identificador del profesional" });
    return;
  }

  await deleteBarber(id);
  response.json({ message: "Profesional eliminado" });
});

app.get("/api/admin/settings", requireAdmin, async (_request, response) => {
  const catalog = await getCatalog();
  response.json({ schedule: catalog.schedule });
});

app.put("/api/admin/settings", requireAdmin, async (request, response) => {
  response.json({ schedule: await saveSchedule(request.body.schedule || {}) });
});

app.get("/api/admin/blocks", requireAdmin, async (request, response) => {
  response.json({ blocks: await getBlocks(String(request.query.date || "")) });
});

app.post("/api/admin/blocks", requireAdmin, async (request, response) => {
  const { date, startTime, endTime } = request.body;

  if (!date || !startTime || !endTime || endTime <= startTime) {
    response.status(400).json({ message: "Completa correctamente el bloqueo manual" });
    return;
  }

  response.status(201).json({ block: await saveBlock(request.body) });
});

app.delete("/api/admin/blocks", requireAdmin, async (request, response) => {
  const id = String(request.query.id || "");

  if (!id) {
    response.status(400).json({ message: "Falta el identificador del bloqueo" });
    return;
  }

  await deleteBlock(id);
  response.json({ message: "Bloqueo eliminado" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Ocurrio un error interno" });
});

export default app;
