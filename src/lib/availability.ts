import {
  featuredServices,
  stylists,
  weeklyAvailability,
} from "@/lib/site";
import { listActiveBookingsBetween } from "@/lib/booking-repository";

type AvailabilityQuery = {
  serviceName: string;
  preferredStylist?: string;
};

export type AvailableSlot = {
  value: string;
  label: string;
};

export type AvailableDay = {
  date: string;
  label: string;
  slots: AvailableSlot[];
};

const SLOT_INTERVAL_MINUTES = 30;
const DAYS_TO_SHOW = 10;

function getServiceDefinition(serviceName: string) {
  return featuredServices.find((service) => service.name === serviceName);
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function createSlotDate(day: Date, hour: number, minute: number) {
  const slot = new Date(day);
  slot.setHours(hour, minute, 0, 0);
  return slot;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatSlotLabel(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

export async function getAvailableDays({
  serviceName,
  preferredStylist,
}: AvailabilityQuery): Promise<AvailableDay[]> {
  const service = getServiceDefinition(serviceName);

  if (!service) {
    return [];
  }

  const now = new Date();
  const rangeStart = new Date(now);
  rangeStart.setHours(0, 0, 0, 0);

  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + DAYS_TO_SHOW + 1);

  const bookings = await listActiveBookingsBetween(rangeStart, rangeEnd);
  const days: AvailableDay[] = [];

  for (let offset = 0; offset < DAYS_TO_SHOW; offset += 1) {
    const day = new Date(rangeStart);
    day.setDate(day.getDate() + offset);

    const dayRule =
      weeklyAvailability[day.getDay() as keyof typeof weeklyAvailability];

    if (!dayRule) {
      continue;
    }

    const slots: AvailableSlot[] = [];
    const dayStart = createSlotDate(day, dayRule.startHour, 0);
    const dayEnd = createSlotDate(day, dayRule.endHour, 0);

    for (
      let slotStart = new Date(dayStart);
      addMinutes(slotStart, service.durationMinutes) <= dayEnd;
      slotStart = addMinutes(slotStart, SLOT_INTERVAL_MINUTES)
    ) {
      if (slotStart <= now) {
        continue;
      }

      const slotEnd = addMinutes(slotStart, service.durationMinutes);

      const overlappingBookings = bookings.filter((booking) => {
        if (!booking.preferredDate) {
          return false;
        }

        const bookingStart = new Date(booking.preferredDate);
        const bookingService =
          getServiceDefinition(booking.requestedService) ?? featuredServices[0];
        const bookingEnd = addMinutes(
          bookingStart,
          bookingService.durationMinutes,
        );

        return overlaps(slotStart, slotEnd, bookingStart, bookingEnd);
      });

      const totalCapacityReached =
        overlappingBookings.length >= stylists.length;

      const preferredStylistBusy = preferredStylist
        ? overlappingBookings.some(
            (booking) => booking.preferredStylist === preferredStylist,
          )
        : false;

      if (totalCapacityReached || preferredStylistBusy) {
        continue;
      }

      slots.push({
        value: slotStart.toISOString(),
        label: formatSlotLabel(slotStart),
      });
    }

    if (!slots.length) {
      continue;
    }

    days.push({
      date: day.toISOString(),
      label: formatDayLabel(day),
      slots,
    });
  }

  return days;
}

export async function isBookingSlotAvailable({
  serviceName,
  preferredDate,
  preferredStylist,
}: {
  serviceName: string;
  preferredDate: Date;
  preferredStylist?: string;
}) {
  const availableDays = await getAvailableDays({
    serviceName,
    preferredStylist,
  });

  return availableDays.some((day) =>
    day.slots.some((slot) => slot.value === preferredDate.toISOString()),
  );
}
