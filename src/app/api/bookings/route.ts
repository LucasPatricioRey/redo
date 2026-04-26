import { NextResponse } from "next/server";
import { z } from "zod";

import { createBookingInquiry } from "@/lib/booking-repository";

const bookingSchema = z.object({
  clientName: z.string().min(2).max(80),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8).max(30),
  requestedService: z.string().min(2).max(80),
  preferredDate: z.string().datetime().optional(),
  preferredStylist: z.string().max(80).optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bookingSchema.parse(json);
    const booking = await createBookingInquiry({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      requestedService: data.requestedService,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      preferredStylist: data.preferredStylist,
      notes: data.notes,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Solicitud registrada correctamente.",
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Datos invalidos para la reserva.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message:
          "No se pudo registrar la solicitud. Verifica MongoDB y las variables de entorno.",
      },
      { status: 500 },
    );
  }
}
