import {
  CodeXml,
  MessagesSquare,
  Mic2,
  Network,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

interface Possibility {
  title: string;
  description: string;
  icon: LucideIcon;
}

const possibilities: Possibility[] = [
  {
    title: "Hackathon",
    description: "Construye algo junto a otros developers.",
    icon: CodeXml,
  },
  {
    title: "Talks",
    description: "Aprende de personas que construyen tecnología real.",
    icon: Mic2,
  },
  {
    title: "Workshops",
    description: "Menos slides. Más hacer.",
    icon: Wrench,
  },
  {
    title: "Mentoring",
    description: "Pide ayuda cuando realmente la necesites.",
    icon: MessagesSquare,
  },
  {
    title: "Networking",
    description: "Conoce developers, founders, empresas y comunidades.",
    icon: Network,
  },
  {
    title: "Community",
    description: "Que COMFECO no termine cuando termina el evento.",
    icon: UsersRound,
  },
];

export function Possibilities() {
  return (
    <section id="que-es" className="section-shell scroll-mt-24">
      <div className="max-w-2xl">
        <p className="section-kicker">Lo que estamos imaginando</p>
        <h2 className="section-title">Más que una hackathon.</h2>
        <p className="section-copy">
          La idea es crear un lugar donde construir, aprender y conocer gente
          que también vive creando cosas.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
        {possibilities.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="group bg-[#090c11] p-5 transition-colors hover:bg-[#0d1218] sm:p-6"
          >
            <div className="mb-5 flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.035] text-zinc-500 transition-colors group-hover:border-cyan-300/20 group-hover:text-cyan-300">
              <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-zinc-100">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
