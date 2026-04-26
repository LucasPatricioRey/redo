import { updateBookingStatusAction } from "@/app/admin/actions";
import type { BookingInquiry } from "@/lib/booking-repository";

type BookingStatusActionsProps = {
  booking: BookingInquiry;
};

const actions = [
  {
    status: "pending" as const,
    label: "Marcar pendiente",
    className: "border-[#7a5b38] text-[#f0d7bb] hover:bg-[#33281d]",
  },
  {
    status: "confirmed" as const,
    label: "Confirmar",
    className: "border-[#2f6a54] text-[#9ed7bf] hover:bg-[#162821]",
  },
  {
    status: "cancelled" as const,
    label: "Cancelar",
    className: "border-[#6e3e3e] text-[#f2b2b2] hover:bg-[#2d1c1c]",
  },
];

export function BookingStatusActions({ booking }: BookingStatusActionsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2 xl:justify-end">
      {actions.map((action) => (
        <form
          key={action.status}
          action={updateBookingStatusAction.bind(null, booking.id, action.status)}
        >
          <button
            type="submit"
            disabled={booking.status === action.status}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
          >
            {action.label}
          </button>
        </form>
      ))}
    </div>
  );
}
