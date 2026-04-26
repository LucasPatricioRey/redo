import { NextResponse } from "next/server";
import { z } from "zod";

import { getAvailableDays } from "@/lib/availability";

const availabilitySchema = z.object({
  service: z.string().min(2),
  stylist: z.string().min(2).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = availabilitySchema.safeParse({
    service: searchParams.get("service") ?? "",
    stylist: searchParams.get("stylist") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Parametros invalidos para consultar disponibilidad." },
      { status: 400 },
    );
  }

  const days = await getAvailableDays({
    serviceName: parsed.data.service,
    preferredStylist: parsed.data.stylist,
  });

  return NextResponse.json({ days });
}
