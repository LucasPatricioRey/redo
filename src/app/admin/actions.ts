"use server";

import { revalidatePath } from "next/cache";

import { requireAdminAuth, signOutAdmin } from "@/lib/admin-auth";
import {
  type BookingStatus,
  updateBookingInquiryStatus,
} from "@/lib/booking-repository";

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
) {
  await requireAdminAuth();
  await updateBookingInquiryStatus(bookingId, status);
  revalidatePath("/admin");
}

export async function signOutAdminAction() {
  await requireAdminAuth();
  await signOutAdmin();
  revalidatePath("/admin");
}
