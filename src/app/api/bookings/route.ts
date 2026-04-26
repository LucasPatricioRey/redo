import { NextResponse } from "next/server";
import { z } from "zod";

import { getDb } from "@/lib/db";

const bookingSchema = z.object({
  clientName: z.string().min(2).max(80),
  clientEmail: z.email(),
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
    const db = getDb();

    const booking = await db.bookingInquiry.create({
      data: {
        ...data,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
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
          "No se pudo registrar la solicitud. Verifica la base de datos y las variables de entorno.",
      },
      { status: 500 },
    );
  }
}
