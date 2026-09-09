import Image from "next/image";

import { WaitlistForm } from "@/components/landing/waitlist-form";

export default function Home() {
  return (
    <main id="contenido">
      <section className="relative isolate flex min-h-svh overflow-hidden bg-[#2F2F33]">
        <div
          className="absolute right-[-12%] top-[-18%] -z-10 size-[70vw] rounded-full bg-[#8F3FD1]/20 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-24%] right-[8%] -z-10 size-[45vw] rounded-full bg-[#B22CC4]/15 blur-[120px]"
          aria-hidden="true"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <Image
            src="/comfeco-imagotipo.png"
            alt="COMFECO — Community Fest and Code"
            width={284}
            height={76}
            priority
            className="h-auto w-56 sm:w-64"
          />

          <div className="my-auto max-w-2xl py-16 sm:py-24">
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F4C53A]">
              Community Fest and Code
            </p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              La comunidad tech de LATAM se vuelve a encontrar.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[#D9D2DD] sm:text-xl">
              COMFECO es el punto de encuentro para aprender, crear y conectar
              con developers de toda Latinoamérica a través de conferencias,
              workshops y hackathons.
            </p>

            <div className="mt-10 max-w-xl">
              <WaitlistForm />
            </div>
          </div>

          <p className="text-xs text-[#D9D2DD]/70">
            Sé de los primeros en enterarte de la próxima edición.
          </p>
        </div>
      </section>
    </main>
  );
}
