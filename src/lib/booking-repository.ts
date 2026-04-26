import { ObjectId } from "mongodb";

import { getMongoDb } from "@/lib/mongodb";

export type BookingInquiryDocument = {
  _id?: ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestedService: string;
  preferredDate: Date | null;
  preferredStylist?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION_NAME = "booking_inquiries";

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
