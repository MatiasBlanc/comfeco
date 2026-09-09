import { Badge } from "@/components/ui/badge";

const disciplines = [
  "Frontend",
  "Backend",
  "Full Stack",
  "AI / ML",
  "Data",
  "Mobile",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "Game Dev",
  "Design",
  "Product",
  "Open Innovation",
];

export function Disciplines() {
  return (
    <section id="idea" className="border-y border-white/[0.06] bg-[#090c11] scroll-mt-16">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-kicker">Un ecosistema, no una burbuja</p>
          <h2 className="section-title max-w-xl">
            No queremos hacer React vs Vue otra vez.
          </h2>
          <p className="section-copy">Frontend es solo una parte del ecosistema.</p>
        </div>

        <div>
          <div className="flex flex-wrap gap-2.5">
            {disciplines.map((discipline) => (
              <Badge key={discipline}>{discipline}</Badge>
            ))}
          </div>
          <p className="mt-6 border-l border-cyan-300/40 pl-4 text-sm leading-6 text-zinc-400">
            Los tracks reales se definirán según lo que quiera la comunidad.
          </p>
        </div>
      </div>
    </section>
  );
}
