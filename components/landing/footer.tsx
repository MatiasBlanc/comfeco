import Link from "next/link";

const footerLinks = [
  { label: "X / Twitter", href: "https://twitter.com/comfeco" },
  { label: "GitHub", href: "https://github.com/Comfeco" },
  { label: "Contacto", href: "mailto:comfeco.info@gmail.com" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="#inicio"
            className="font-mono text-sm font-bold tracking-[0.16em] text-white"
          >
            COMFECO
          </Link>
          <p className="mt-2 text-sm text-zinc-500">Community Fest and Code</p>
          <p className="mt-5 font-mono text-xs text-zinc-700">
            Construido por la comunidad.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500" aria-label="Enlaces externos">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
