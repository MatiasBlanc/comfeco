import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

const contactUrl =
  process.env.NEXT_PUBLIC_PARTNERS_CONTACT_URL ??
  "mailto:comfeco.info@gmail.com?subject=Partnership%20COMFECO";

export function Partners() {
  return (
    <section id="partners" className="section-shell scroll-mt-20 pt-4">
      <div className="flex flex-col justify-between gap-7 rounded-xl border border-white/[0.09] bg-[#0c1016] p-6 sm:p-8 md:flex-row md:items-center">
        <div className="flex gap-4">
          <div className="hidden size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-cyan-300 sm:flex">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              ¿Representas a una empresa o comunidad?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Estamos empezando a conversar con empresas, comunidades y
              organizaciones que quieran construir COMFECO junto a nosotros.
            </p>
          </div>
        </div>
        <Link
          href={contactUrl}
          data-analytics-event="sponsor_cta_click"
          className={`${buttonVariants({ variant: "outline" })} shrink-0`}
        >
          Quiero hablar sobre partnerships
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
