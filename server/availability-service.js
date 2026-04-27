import { barbers, services, studioInfo } from "../shared/site.js";

const dayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function toMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeLabel(value) {
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export function getWorkingDay(date) {
  const parsedDate = new Date(`${date}T12:00:00`);
  const dayKey = dayMap[parsedDate.getDay()];
  return studioInfo.schedule[dayKey];
}

export function buildAvailableSlots({ date, barberSlug, serviceSlug, bookings }) {
  const workingDay = getWorkingDay(date);
  const service = services.find((item) => item.slug === serviceSlug);
  const barber = barbers.find((item) => item.slug === barberSlug);

  if (!workingDay?.enabled || !service || !barber) {
    return [];
  }

  const open = toMinutes(workingDay.open);
  const close = toMinutes(workingDay.close);
  const occupiedBookings = bookings.filter(
    (booking) => booking.barberSlug === barberSlug && booking.status !== "cancelado"
  );

  const slots = [];

  for (let cursor = open; cursor + service.duration <= close; cursor += 30) {
    const slotStart = cursor;
    const slotEnd = cursor + service.duration;

    const isTaken = occupiedBookings.some((booking) => {
      const bookingStart = toMinutes(booking.time);
      const bookingEnd = bookingStart + booking.serviceDuration;
      return overlaps(slotStart, slotEnd, bookingStart, bookingEnd);
    });

    if (!isTaken) {
      slots.push(toTimeLabel(cursor));
    }
  }

  return slots;
}
