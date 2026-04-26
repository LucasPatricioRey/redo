"use client";

import { useState, useTransition } from "react";

type ServiceOption = {
  name: string;
  duration: string;
  price: string;
};

type StylistOption = {
  name: string;
  role: string;
};

type BookingRequestFormProps = {
  services: readonly ServiceOption[];
  stylists: readonly StylistOption[];
};

type FormState = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  requestedService: string;
  preferredDate: string;
  preferredStylist: string;
  notes: string;
};

const initialFormState: FormState = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  requestedService: "",
  preferredDate: "",
  preferredStylist: "",
  notes: "",
};

export function BookingRequestForm({
  services,
  stylists,
}: BookingRequestFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [serverMessage, setServerMessage] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage("");
    setServerError("");

    startTransition(async () => {
      try {
        const payload = {
          ...formState,
          preferredDate: formState.preferredDate
            ? new Date(formState.preferredDate).toISOString()
            : undefined,
          preferredStylist: formState.preferredStylist || undefined,
          notes: formState.notes.trim() || undefined,
        };

        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = (await response.json()) as { message?: string };

        if (!response.ok) {
          setServerError(
            result.message || "No se pudo enviar la solicitud en este momento.",
          );
          return;
        }

        setServerMessage(
          result.message ||
            "Solicitud enviada. REDO se va a contactar para confirmar el turno.",
        );
        setFormState(initialFormState);
      } catch {
        setServerError("Ocurrio un error de conexion. Intenta nuevamente.");
      }
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted">
          Nombre y apellido
          <input
            required
            value={formState.clientName}
            onChange={(event) => updateField("clientName", event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
            placeholder="Tu nombre"
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          Email
          <input
            required
            type="email"
            value={formState.clientEmail}
            onChange={(event) => updateField("clientEmail", event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
            placeholder="nombre@email.com"
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          Telefono
          <input
            required
            value={formState.clientPhone}
            onChange={(event) => updateField("clientPhone", event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
            placeholder="+54 11 ..."
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          Servicio
          <select
            required
            value={formState.requestedService}
            onChange={(event) =>
              updateField("requestedService", event.target.value)
            }
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
          >
            <option value="">Seleccionar servicio</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name} · {service.duration} · {service.price}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-muted">
          Fecha y horario preferido
          <input
            type="datetime-local"
            value={formState.preferredDate}
            onChange={(event) =>
              updateField("preferredDate", event.target.value)
            }
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          Profesional preferido
          <select
            value={formState.preferredStylist}
            onChange={(event) =>
              updateField("preferredStylist", event.target.value)
            }
            className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
          >
            <option value="">Sin preferencia</option>
            {stylists.map((stylist) => (
              <option key={stylist.name} value={stylist.name}>
                {stylist.name} · {stylist.role}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-muted">
        Comentarios
        <textarea
          rows={5}
          value={formState.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="rounded-2xl border border-border bg-surface-strong px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
          placeholder="Contanos si queres un estilo puntual, un horario especifico o algun detalle extra."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6 text-sm">
          {serverMessage ? (
            <p className="text-accent-soft">{serverMessage}</p>
          ) : null}
          {serverError ? <p className="text-red-300">{serverError}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1b1510] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Enviando..." : "Solicitar turno"}
        </button>
      </div>
    </form>
  );
}
