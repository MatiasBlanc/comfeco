"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import {
  COUNTRY_OPTIONS,
  INTEREST_OPTIONS,
  PROFILE_OPTIONS,
  SOURCE_OPTIONS,
  TEAM_OPTIONS,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

interface ApiResponse {
  ok?: boolean;
  message?: string;
}

interface CheckboxGroupProps {
  legend: string;
  description: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  columns?: "two" | "three";
}

function CheckboxGroup({
  legend,
  description,
  options,
  selected,
  onChange,
  columns = "two",
}: CheckboxGroupProps) {
  const toggleValue = (value: string, isChecked: boolean) => {
    onChange(
      isChecked
        ? [...selected, value]
        : selected.filter((item) => item !== value),
    );
  };

  return (
    <fieldset>
      <legend className="form-label">{legend}</legend>
      <p className="mb-3 text-xs text-zinc-600">{description}</p>
      <div
        className={cn(
          "grid gap-2",
          columns === "three"
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2",
        )}
      >
        {options.map((option) => {
          const id = `${legend}-${option}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
          return (
            <label
              key={option}
              htmlFor={id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors",
                selected.includes(option)
                  ? "border-cyan-300/30 bg-cyan-300/[0.055] text-zinc-100"
                  : "border-white/[0.08] bg-black/15 text-zinc-400 hover:border-white/15 hover:text-zinc-200",
              )}
            >
              <Checkbox
                id={id}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => toggleValue(option, checked === true)}
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function WaitlistForm() {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasStarted = useRef(false);
  const startedAt = useRef(0);

  const handleStart = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startedAt.current = Date.now();
      trackEvent(ANALYTICS_EVENTS.waitlistStarted);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profiles.length === 0 || interests.length === 0) {
      toast.error("Selecciona al menos un perfil y un interés.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      country: formData.get("country"),
      profiles,
      interests,
      wishlist: formData.get("wishlist"),
      teamPreference: formData.get("teamPreference"),
      source: formData.get("source"),
      wantsUpdates,
      website: formData.get("website"),
      startedAt: startedAt.current,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos guardar tu lugar.");
      }

      trackEvent(ANALYTICS_EVENTS.waitlistSubmitted);
      setIsSubmitted(true);
      toast.success("Tu lugar quedó guardado.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Algo salió mal. Inténtalo de nuevo.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const shareText = encodeURIComponent(
      "COMFECO podría volver. Ya me sumé para ayudar a construir la próxima edición junto a la comunidad developer de LATAM.",
    );

    return (
      <Card className="overflow-hidden border-cyan-300/20 bg-cyan-300/[0.035]">
        <CardContent className="flex min-h-[430px] flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
          <div className="flex size-14 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-300">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            Registro completado
          </p>
          <h3 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Estás dentro.
          </h3>
          <p className="mt-4 max-w-md leading-7 text-zinc-400">
            Gracias por ayudarnos a construir lo que podría convertirse en
            COMFECO V2.
          </p>
          <Link
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
          >
            Compartir COMFECO
            <Send className="size-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5 sm:p-7 lg:p-9">
        <form
          onSubmit={handleSubmit}
          onFocusCapture={handleStart}
          aria-label="Formulario para unirse a la waitlist de COMFECO"
        >
          <fieldset disabled={isSubmitting} className="space-y-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder="tu@email.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="form-label">
                  País
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    required
                    defaultValue=""
                    className="h-11 w-full appearance-none rounded-md border border-white/10 bg-black/25 px-3 pr-10 text-base text-white outline-none transition hover:border-white/20 focus-visible:border-cyan-300/70 focus-visible:ring-2 focus-visible:ring-cyan-300/15 md:text-sm"
                  >
                    <option value="" disabled className="bg-[#101319]">
                      Selecciona tu país
                    </option>
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country} value={country} className="bg-[#101319]">
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-3.5 size-4 text-zinc-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/[0.07]" />

            <CheckboxGroup
              legend="¿Qué haces en tech?"
              description="Puedes elegir más de una opción."
              options={PROFILE_OPTIONS}
              selected={profiles}
              onChange={setProfiles}
              columns="three"
            />

            <CheckboxGroup
              legend="¿Qué te interesa de COMFECO?"
              description="Marca todo lo que te gustaría encontrar."
              options={INTEREST_OPTIONS}
              selected={interests}
              onChange={setInterests}
            />

            <div>
              <label htmlFor="wishlist" className="form-label">
                ¿Qué tendría que tener COMFECO V2 para que quisieras participar?
              </label>
              <p className="mb-3 text-xs text-zinc-600">
                Esta respuesta va a ayudarnos a tomar decisiones reales.
              </p>
              <Textarea
                id="wishlist"
                name="wishlist"
                required
                minLength={10}
                maxLength={1000}
                placeholder="Un formato, una experiencia, algo que no puede faltar…"
              />
              <p className="mt-2 text-right font-mono text-[10px] text-zinc-700">
                Máximo 1.000 caracteres
              </p>
            </div>

            <div className="h-px bg-white/[0.07]" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="teamPreference" className="form-label">
                  ¿Cómo participarías en una hackathon?
                  <span className="ml-2 text-xs font-normal text-zinc-600">Opcional</span>
                </label>
                <div className="relative">
                  <select
                    id="teamPreference"
                    name="teamPreference"
                    defaultValue=""
                    className="form-select"
                  >
                    <option value="" className="bg-[#101319]">
                      Selecciona una opción
                    </option>
                    {TEAM_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-[#101319]">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-chevron" aria-hidden="true" />
                </div>
              </div>
              <div>
                <label htmlFor="source" className="form-label">
                  ¿Cómo te enteraste?
                  <span className="ml-2 text-xs font-normal text-zinc-600">Opcional</span>
                </label>
                <div className="relative">
                  <select
                    id="source"
                    name="source"
                    defaultValue=""
                    className="form-select"
                  >
                    <option value="" className="bg-[#101319]">
                      Selecciona una opción
                    </option>
                    {SOURCE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-[#101319]">
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-chevron" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Sitio web</label>
              <input
                id="website"
                name="website"
                type="text"
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <label
              htmlFor="wantsUpdates"
              className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-400"
            >
              <Checkbox
                id="wantsUpdates"
                checked={wantsUpdates}
                onCheckedChange={(checked) => setWantsUpdates(checked === true)}
                className="mt-1"
              />
              Quiero recibir novedades sobre COMFECO.
            </label>

            <Button type="submit" size="lg" className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Guardando mi lugar...
                </>
              ) : (
                <>
                  Unirme a COMFECO
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
