import Image from "next/image";
import type { JSX } from "react";

import { WaitlistForm } from "./waitlist-form";

/**
 * Renderiza la landing mínima de la waitlist de COMFECO.
 *
 * @returns Página de presentación y registro por correo.
 */
export default function Home(): JSX.Element {
  return (
    <main id="contenido" className="waitlist">
      <Image
        src="/sponsors-banner.webp"
        alt=""
        fill
        sizes="100vw"
        className="sponsors-background"
      />
      <div className="page-shell">
        <Image
          src="/comfeco-imagotipo.png"
          alt="COMFECO — Community Fest and Code"
          width={284}
          height={76}
          priority
          className="brand"
        />

        <section className="content" aria-labelledby="waitlist-title">
          <p className="eyebrow">Community Fest and Code</p>
          <h1 id="waitlist-title">
            La comunidad tech de LATAM se vuelve a encontrar.
          </h1>
          <p className="description">
            COMFECO es el punto de encuentro para aprender, crear y conectar
            con developers de toda Latinoamérica a través de conferencias,
            workshops y hackathons.
          </p>
          <WaitlistForm />
        </section>

        <p className="footer-copy">
          Sé de los primeros en enterarte de la próxima edición.
        </p>
      </div>
    </main>
  );
}
