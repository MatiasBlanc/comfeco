import { useEffect, type JSX, type ReactNode } from "react";

interface SimpleLayoutProps {
  title: ReactNode;
  description?: ReactNode;
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
    <main className="relative isolate min-h-svh overflow-x-hidden bg-[linear-gradient(145deg,#2E2E2E_0%,#390F64_42%,#521E87_75%,#2E2E2E_130%)] font-sans text-charcoal antialiased">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:py-12">
        <div className="mb-6">
          <a
            href="/"
            aria-label="COMFECO — ir al inicio"
            className="inline-block rounded-lg outline-none transition focus-visible:ring-3 focus-visible:ring-[#FFD400]"
          >
            <img
              src="/brand/logo-horizontal.png"
              alt="COMFECO — Community Fest and Code"
              width="356"
              height="95"
              className="h-10 w-auto"
            />
          </a>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-[#F3E8F4] sm:text-lg">{description}</p>
        ) : null}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white p-6 shadow-[0_1.5rem_4rem_rgba(57,15,100,0.35)] sm:p-10">
          {children}
        </div>
      </div>
    </main>
  );
}
