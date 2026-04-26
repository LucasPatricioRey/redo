import { ObjectId } from "mongodb";

import { getMongoDb } from "@/lib/mongodb";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingInquiryDocument = {
  _id?: ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestedService: string;
  preferredDate: Date | null;
  preferredStylist?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type BookingInquiry = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestedService: string;
  preferredDate: string | null;
  preferredStylist?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type BookingOverview = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

type ListBookingInquiriesFilters = {
  status?: BookingStatus;
  query?: string;
};

const COLLECTION_NAME = "booking_inquiries";

function serializeBooking(document: BookingInquiryDocument): BookingInquiry {
  return {
    id: document._id!.toString(),
    clientName: document.clientName,
    clientEmail: document.clientEmail,
    clientPhone: document.clientPhone,
    requestedService: document.requestedService,
    preferredDate: document.preferredDate?.toISOString() ?? null,
    preferredStylist: document.preferredStylist,
    notes: document.notes,
    status: document.status,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export async function createBookingInquiry(
  payload: Omit<BookingInquiryDocument, "_id" | "createdAt" | "updatedAt">,
) {
  const db = await getMongoDb();
  const now = new Date();

  const booking: BookingInquiryDocument = {
    ...payload,
    preferredDate: payload.preferredDate ?? null,
    preferredStylist: payload.preferredStylist?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db
    .collection<BookingInquiryDocument>(COLLECTION_NAME)
    .insertOne(booking);

  return {
    id: result.insertedId.toString(),
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBookingQuery(filters?: ListBookingInquiriesFilters) {
  const query: Record<string, unknown> = {};

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.query?.trim()) {
    const search = new RegExp(escapeRegExp(filters.query.trim()), "i");

    query.$or = [
      { clientName: search },
      { clientEmail: search },
      { clientPhone: search },
      { requestedService: search },
      { preferredStylist: search },
    ];
  }

  return query;
}

export async function listBookingInquiries(filters?: ListBookingInquiriesFilters) {
  const db = await getMongoDb();
  const query = buildBookingQuery(filters);

  const bookings = await db
    .collection<BookingInquiryDocument>(COLLECTION_NAME)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return bookings.map(serializeBooking);
}

export async function getBookingOverview(): Promise<BookingOverview> {
  const db = await getMongoDb();
  const collection = db.collection<BookingInquiryDocument>(COLLECTION_NAME);

  const [total, pending, confirmed, cancelled] = await Promise.all([
    collection.countDocuments(),
    collection.countDocuments({ status: "pending" }),
    collection.countDocuments({ status: "confirmed" }),
    collection.countDocuments({ status: "cancelled" }),
  ]);

  return {
    total,
    pending,
    confirmed,
    cancelled,
  };
}

export async function updateBookingInquiryStatus(
  bookingId: string,
  status: BookingStatus,
) {
  const db = await getMongoDb();

  if (!ObjectId.isValid(bookingId)) {
    throw new Error("ID de reserva invalido.");
  }

  const result = await db.collection<BookingInquiryDocument>(COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(bookingId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  if (!result) {
    throw new Error("No se encontro la reserva a actualizar.");
  }

  return serializeBooking(result);
}

export async function listActiveBookingsBetween(start: Date, end: Date) {
  const db = await getMongoDb();

  const bookings = await db
    .collection<BookingInquiryDocument>(COLLECTION_NAME)
    .find({
      status: { $in: ["pending", "confirmed"] },
      preferredDate: {
        $gte: start,
        $lt: end,
      },
    })
    .toArray();

  return bookings.map(serializeBooking);
}
