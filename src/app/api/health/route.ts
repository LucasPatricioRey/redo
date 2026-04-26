import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    app: "REDO",
    status: "ok",
    database: "mongodb",
    timestamp: new Date().toISOString(),
  });
}
