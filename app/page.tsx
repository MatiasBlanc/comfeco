import { Disciplines } from "@/components/landing/disciplines";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { History } from "@/components/landing/history";
import { Navbar } from "@/components/landing/navbar";
import { Partners } from "@/components/landing/partners";
import { Possibilities } from "@/components/landing/possibilities";
import { WaitlistForm } from "@/components/landing/waitlist-form";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Possibilities />
        <Disciplines />
        <History />

        <section
          id="waitlist"
          className="relative scroll-mt-16 border-y border-white/[0.06] bg-[#090c11]"
        >
          <div
            className="absolute inset-x-0 top-0 h-64 bg-cyan-300/[0.025] blur-3xl"
            aria-hidden="true"
          />
          <div className="section-shell relative grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="section-kicker">Tu input importa</p>
              <h2 className="section-title">
                Ayúdanos a construir COMFECO V2.
              </h2>
              <p className="section-copy">
                Déjanos saber quién eres y qué tendría que tener COMFECO para
                que dijeras: “quiero participar en esto”.
              </p>
              <div className="mt-8 space-y-3 font-mono text-xs text-zinc-600">
                <p>
                  <span className="mr-2 text-cyan-300">01</span> Te toma unos
                  minutos
                </p>
                <p>
                  <span className="mr-2 text-cyan-300">02</span> Sin cuentas ni
                  contraseñas
                </p>
                <p>
                  <span className="mr-2 text-cyan-300">03</span> Tu opinión
                  define la idea
                </p>
              </div>
            </div>
            <WaitlistForm />
          </div>
        </section>

        <Partners />
      </main>
      <Footer />
    </>
  );
}
