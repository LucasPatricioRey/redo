import { redirect } from "next/navigation";

import { signInAdminAction } from "@/app/admin-login/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : undefined;
  const hasError = params?.error === "1";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-8 sm:px-10 lg:px-12">
      <section className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-border bg-surface p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
            REDO Admin Access
          </p>
          <h1 className="mt-3 font-heading text-5xl text-foreground sm:text-6xl">
            Acceso al panel operativo
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            Inicia sesion para revisar solicitudes, actualizar estados y seguir
            la agenda comercial del estudio.
          </p>
        </article>

        <article className="rounded-[2rem] border border-border bg-surface p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-soft">
            Iniciar sesion
          </p>
          <form action={signInAdminAction} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm text-muted">
              Usuario
              <input
                name="username"
                required
                className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
                placeholder="Usuario admin"
              />
            </label>

            <label className="grid gap-2 text-sm text-muted">
              Clave
              <input
                name="password"
                required
                type="password"
                className="h-12 rounded-2xl border border-border bg-surface-strong px-4 text-foreground outline-none transition-colors focus:border-accent"
                placeholder="Clave de acceso"
              />
            </label>

            {hasError ? (
              <p className="text-sm text-red-300">
                Usuario o clave incorrectos.
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1b1510] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Entrar al panel
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
