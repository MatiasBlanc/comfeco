import { useEffect, type JSX, type ReactNode } from "react";

interface SimpleLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Encabezado mínimo reutilizado por `/survey` y `/pulse`.
 *
 * @param title - Título visible de la página.
 * @param description - Texto de apoyo opcional.
 * @param children - Contenido principal dentro de la tarjeta.
 * @returns Layout mobile-first con branding de COMFECO.
 */
export default function SimpleLayout({
  title,
  description,
  children,
}: SimpleLayoutProps): JSX.Element {
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <main className="relative isolate min-h-svh overflow-x-hidden bg-[linear-gradient(145deg,#FFFFFF_0%,#390F64_42%,#521E87_75%,#FFFFFF_130%)] font-sans text-charcoal antialiased">
      <header className="border-b border-charcoal/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center px-5 py-3">
          <a
            href="/"
            aria-label="COMFECO — ir al inicio"
            className="rounded-lg outline-none transition focus-visible:ring-3 focus-visible:ring-violet/40"
          >
            <img
              src="/brand/logo-horizontal.png"
              alt="COMFECO — Community Fest and Code"
              width="356"
              height="95"
              className="h-9 w-auto"
            />
          </a>
        </div>
      </header>
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-16">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg text-white/80">{description}</p>
        ) : null}
        <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_1.5rem_4rem_rgba(70,20,111,0.08)] sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
