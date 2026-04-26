import {
  experienceHighlights,
  featuredServices,
  metrics,
  roadmap,
  siteConfig,
  stylists,
} from "@/lib/site";
import { BookingRequestForm } from "@/components/booking-request-form";

const stack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS 4",
  "MongoDB",
  "MongoDB Driver",
  "Zod",
  "Vercel",
] as const;

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-border bg-surface/75 px-6 py-5 backdrop-blur sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-soft">
                REDO Studio
              </p>
              <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl">
                Barberia y peluqueria premium con presencia digital real.
              </h1>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted sm:text-right">
              <span>{siteConfig.location}</span>
              <span>{siteConfig.phone}</span>
              <span>{siteConfig.email}</span>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-border bg-[linear-gradient(145deg,rgba(42,36,31,0.98),rgba(22,18,15,0.92))] p-8 shadow-2xl shadow-black/20 sm:p-12">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-accent-soft">
              Concepto del producto
            </p>
            <h2 className="max-w-3xl font-heading text-5xl leading-none text-foreground sm:text-7xl">
              Una marca de grooming que combina precision, experiencia y tecnologia.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {siteConfig.description} REDO combina una presencia digital
              cuidada con una base tecnica preparada para reservas online,
              administracion interna y crecimiento operativo.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#mvp"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1b1510] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Ver MVP
              </a>
              <a
                href="#stack"
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
              >
                Revisar stack
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            <article className="rounded-[1.75rem] border border-border bg-surface p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
                Posicionamiento
              </p>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {siteConfig.tagline}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Imagen premium, operacion simple y foco en experiencia de
                cliente para transmitir una marca seria y confiable.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-border bg-surface p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
                Beneficios clave
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
                {experienceHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[1.5rem] border border-border bg-surface px-6 py-7"
            >
              <p className="font-heading text-5xl text-accent-soft">
                {metric.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">
                {metric.label}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article
            id="mvp"
            className="rounded-[2rem] border border-border bg-surface p-8"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              MVP recomendado
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
              {roadmap.mvp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Fase siguiente
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
              {roadmap.next.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
                  Servicios destacados
                </p>
                <h3 className="mt-3 font-heading text-4xl text-foreground">
                  Oferta creible para un negocio real
                </h3>
              </div>
            </div>
            <div className="mt-8 grid gap-4">
              {featuredServices.map((service) => (
                <article
                  key={service.name}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-xl font-semibold text-foreground">
                      {service.name}
                    </h4>
                    <div className="flex gap-3 text-sm text-accent-soft">
                      <span>{service.duration}</span>
                      <span>{service.price}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Equipo
            </p>
            <div className="mt-7 space-y-4">
              {stylists.map((stylist) => (
                <article
                  key={stylist.name}
                  className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {stylist.name}
                      </h4>
                      <p className="text-sm text-accent-soft">{stylist.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {stylist.specialty}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Reservas
            </p>
            <h3 className="mt-3 font-heading text-4xl text-foreground">
              Solicita tu turno en pocos pasos.
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              El cliente puede enviar una solicitud con su servicio, horario
              estimado y profesional preferido. REDO recibe la consulta y
              confirma la disponibilidad.
            </p>
            <div className="mt-8 space-y-4 text-sm leading-7 text-muted">
              <p>Confirmacion simple para no frenar conversiones.</p>
              <p>Informacion centralizada para ordenar turnos y seguimiento.</p>
              <p>Base lista para sumar panel admin y estados mas adelante.</p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Formulario de solicitud
            </p>
            <div className="mt-6">
              <BookingRequestForm
                services={featuredServices}
                stylists={stylists}
              />
            </div>
          </article>
        </section>

        <section
          id="stack"
          className="grid gap-6 rounded-[2rem] border border-border bg-surface p-8 xl:grid-cols-[0.85fr_1.15fr]"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Stack exacto recomendado
            </p>
            <h3 className="mt-3 font-heading text-4xl text-foreground">
              Un monolito full stack, serio y defendible en entrevistas.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              REDO arranca mejor con un solo repo porque simplifica despliegue,
              mantenimiento y explicacion tecnica. La complejidad queda en un
              nivel sano, pero la arquitectura ya esta preparada para crecer.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stack.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-border bg-surface-strong px-4 py-5 text-sm font-medium text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Estructura del proyecto
            </p>
            <div className="mt-6 space-y-4 font-mono text-sm leading-7 text-muted">
              <p>`src/app` para rutas, landing y endpoints.</p>
              <p>`src/lib` para configuracion, datos y acceso a MongoDB.</p>
              <p>`docs` para definicion de producto y decisiones tecnicas.</p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-border bg-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
              Estado actual
            </p>
            <p className="mt-4 text-sm leading-7 text-muted">
              Esta primera base ya incluye branding, documentacion, endpoint de
              salud, endpoint de reservas con validacion e integracion inicial
              con MongoDB para solicitudes de turno.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent-soft">
                listo para Vercel
              </span>
              <span className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent-soft">
                listo para MongoDB
              </span>
              <span className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent-soft">
                listo para reservas
              </span>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
