import Image from "next/image";

import { WaitlistForm } from "@/components/landing/waitlist-form";

export default function Home() {
  return (
    <main id="contenido">
      <section className="relative isolate flex min-h-svh overflow-hidden bg-[#050708]">
        <Image
          src="/comfeco-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(3,5,6,0.96)_0%,rgba(3,5,6,0.82)_48%,rgba(3,5,6,0.42)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(3,5,6,0.9)_0%,transparent_40%,rgba(3,5,6,0.38)_100%)]"
          aria-hidden="true"
        />

        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <p className="text-lg font-bold tracking-[-0.03em] text-white">
            COMFECO<span className="text-cyan-300">.</span>
          </p>

          <div className="my-auto max-w-2xl py-16 sm:py-24">
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Community Fest and Code
            </p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              La comunidad tech de LATAM se vuelve a encontrar.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-zinc-300 sm:text-xl">
              COMFECO es el punto de encuentro para aprender, crear y conectar
              con developers de toda Latinoamérica a través de conferencias,
              workshops y hackathons.
            </p>

            <div className="mt-10 max-w-xl">
              <WaitlistForm />
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            Sé de los primeros en enterarte de la próxima edición.
          </p>
        </div>
      </section>
    </main>
  );
}
