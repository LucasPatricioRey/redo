import Link from "next/link";

import {
  BookingStatusActions,
} from "@/components/booking-status-actions";
import { signOutAdminAction } from "@/app/admin/actions";
import { requireAdminAuth } from "@/lib/admin-auth";
import {
  getBookingOverview,
  listBookingInquiries,
} from "@/lib/booking-repository";
import { formatDateTime } from "@/lib/format";

const statusLabels = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
} as const;

const statusClasses = {
  pending: "border-[#7a5b38] bg-[#33281d] text-[#f0d7bb]",
  confirmed: "border-[#2f6a54] bg-[#162821] text-[#9ed7bf]",
  cancelled: "border-[#6e3e3e] bg-[#2d1c1c] text-[#f2b2b2]",
} as const;

export default async function AdminPage() {
  await requireAdminAuth();

  const [overview, bookings] = await Promise.all([
    getBookingOverview(),
    listBookingInquiries(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-8 sm:px-10 lg:px-12">
      <header className="rounded-[2rem] border border-border bg-surface/80 px-6 py-8 backdrop-blur sm:px-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
          REDO Admin
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-5xl text-foreground sm:text-6xl">
              Solicitudes de turno
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Vista operativa para revisar nuevos pedidos, seguir estados y
              mantener ordenada la agenda comercial.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
          >
            Volver al sitio
          </Link>
          <form action={signOutAdminAction}>
            <button
              type="submit"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-border bg-surface px-6 py-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Total
          </p>
          <p className="mt-3 font-heading text-5xl text-foreground">
            {overview.total}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-surface px-6 py-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Pendientes
          </p>
          <p className="mt-3 font-heading text-5xl text-accent-soft">
            {overview.pending}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-surface px-6 py-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Confirmados
          </p>
          <p className="mt-3 font-heading text-5xl text-[#9ed7bf]">
            {overview.confirmed}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-surface px-6 py-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Cancelados
          </p>
          <p className="mt-3 font-heading text-5xl text-[#f2b2b2]">
            {overview.cancelled}
          </p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Bandeja de entradas
            </p>
            <h2 className="mt-2 font-heading text-4xl text-foreground">
              Reservas recientes
            </h2>
          </div>
          <p className="text-sm text-muted">
            {bookings.length} solicitudes registradas
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-surface-strong px-6 py-10 text-sm text-muted">
            Todavia no hay solicitudes registradas.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {booking.clientName}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClasses[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <div className="grid gap-1 text-sm text-muted">
                      <p>{booking.requestedService}</p>
                      <p>{booking.clientEmail}</p>
                      <p>{booking.clientPhone}</p>
                      <p>Turno solicitado: {formatDateTime(booking.preferredDate)}</p>
                      <p>
                        Profesional: {booking.preferredStylist || "Sin preferencia"}
                      </p>
                      <p>Ingresado: {formatDateTime(booking.createdAt)}</p>
                    </div>
                  </div>

                  <div className="max-w-xl text-sm leading-7 text-muted xl:text-right">
                    {booking.notes || "Sin comentarios adicionales."}
                    <BookingStatusActions booking={booking} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
