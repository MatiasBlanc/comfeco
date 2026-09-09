import { useState, type FormEvent, type JSX } from "react";

interface ApiResponse {
  message?: string;
}

/**
 * Renderiza la waitlist y registra correos mediante la función de Vercel.
 *
 * @returns Página completa de la waitlist.
 */
export default function App(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website"),
        }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos guardar tu correo.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Algo salió mal. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate min-h-svh overflow-x-hidden bg-[linear-gradient(145deg,#2E2E2E_0%,#390F64_42%,#521E87_75%,#2E2E2E_130%)] font-['Poppins'] text-white selection:bg-[#8A178C] md:h-svh md:max-h-svh md:overflow-y-hidden">
      <div className="pointer-events-none absolute -left-40 -top-44 -z-10 size-[34rem] rounded-full bg-[#8A178C]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 top-0 -z-10 size-[40rem] rounded-full bg-[#69156A]/45 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-18rem] right-[12%] -z-10 size-[38rem] rounded-full bg-[#FFD400]/15 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <span className="absolute left-[6%] top-[18%] size-6 rotate-12 border-4 border-[#8A178C]/70" />
        <span className="absolute right-[18%] top-[10%] size-7 rotate-45 bg-[#69156A]/80" />
        <span className="absolute right-[7%] top-[32%] size-8 rotate-45 before:absolute before:left-0 before:top-1/2 before:h-1 before:w-full before:-translate-y-1/2 before:rounded-full before:bg-[#8A178C]/70 after:absolute after:left-1/2 after:top-0 after:h-full after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#8A178C]/70" />
        <span className="absolute bottom-[16%] right-[22%] size-0 border-x-[16px] border-b-[28px] border-x-transparent border-b-[#FFD400]/70" />
        <span className="absolute bottom-[10%] left-[9%] size-8 rounded-full border-4 border-[#FFD400]/70" />
        <span className="absolute right-[38%] top-[56%] size-5 -rotate-12 border-4 border-[#8A178C]/60 max-sm:hidden" />
        <span className="absolute left-[48%] top-[28%] size-0 border-x-[13px] border-b-[23px] border-x-transparent border-b-[#FFD400]/60 max-sm:hidden" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh w-[calc(100%_-_2.5rem)] max-w-280 flex-col py-[clamp(1.25rem,3vh,2rem)] md:h-full md:min-h-0">
        <img
          src="/brand/logo-horizontal.png"
          alt="COMFECO — Community Fest and Code"
          width="356"
          height="95"
          className="h-auto w-[clamp(13rem,25vw,17rem)]"
        />

        <section className="my-auto max-w-3xl py-[clamp(2rem,5vh,4rem)]" aria-labelledby="waitlist-title">
          <h1
            id="waitlist-title"
            className="m-0 font-['Lexend'] text-[clamp(3rem,6vw,5rem)] font-bold leading-[0.98] tracking-[-0.055em]"
          >
            Deja de programar
            <span className="mt-[0.12em] block font-['Lexend'] text-[clamp(4.5rem,10vw,8rem)] leading-[0.85] tracking-[-0.08em] text-[#FFD400]">
              Solo.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.6] text-[#F3E8F4]">
            Aprende de los que ya la están rompiendo, compite por premios reales
            y conecta con developers de toda la región.
          </p>

          {isSubmitted ? (
            <p className="mt-10 max-w-2xl rounded-2xl border border-[#FFD400]/45 bg-[#390F64]/55 px-5 py-4 backdrop-blur-xl" role="status">
              Listo. Te avisaremos cuando haya novedades.
            </p>
          ) : (
            <form
              className="relative mt-10 flex max-w-2xl gap-2.5 rounded-2xl border border-[#F3E8F4]/30 bg-[#2E2E2E]/50 p-2.5 shadow-[0_1.5rem_4rem_rgba(57,15,100,0.35)] backdrop-blur-xl max-sm:flex-col"
              onSubmit={handleSubmit}
            >
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                required
                disabled={isSubmitting}
                placeholder="tu@email.com"
                className="min-h-14 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-4 text-base text-white outline-none placeholder:text-[#F3E8F4]/60 focus-visible:border-[#8A178C] focus-visible:ring-3 focus-visible:ring-[#8A178C]/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                className="absolute -left-[10000px]"
                name="website"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#FFD400] bg-[#FFD400] px-6 text-base font-semibold text-[#2E2E2E] shadow-[0_0.75rem_2rem_rgba(105,21,106,0.32)] outline-none transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_1rem_2.5rem_rgba(138,23,140,0.38)] focus-visible:ring-3 focus-visible:ring-[#8A178C] disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
              >
                {isSubmitting ? (
                  "Enviando…"
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-5 fill-none stroke-current stroke-[2]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9"
                      />
                    </svg>
                    Avísame
                  </>
                )}
              </button>
              {errorMessage && (
                <p className="absolute left-3 top-[calc(100%+0.5rem)] m-0 text-sm text-white" role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
