import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#07090d]/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6"
        aria-label="Navegación principal"
      >
        <Link
          href="#inicio"
          className="inline-flex items-center font-mono text-sm font-bold tracking-[0.16em] text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          aria-label="COMFECO, ir al inicio"
        >
          COMFECO
        </Link>

        <div className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          <Link className="transition hover:text-white" href="#que-es">
            ¿Qué es?
          </Link>
          <Link className="transition hover:text-white" href="#idea">
            La idea
          </Link>
          <Link className="transition hover:text-white" href="#waitlist">
            Waitlist
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="#partners"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Soy empresa
          </Link>
          <Link
            href="#waitlist"
            className={buttonVariants({ size: "sm" })}
          >
            <span className="hidden sm:inline">Unirme a la waitlist</span>
            <span className="sm:hidden">Unirme</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
