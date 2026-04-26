"use server";

import { revalidatePath } from "next/cache";

import {
  type BookingStatus,
  updateBookingInquiryStatus,
} from "@/lib/booking-repository";

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
) {
  await updateBookingInquiryStatus(bookingId, status);
  revalidatePath("/admin");
}
