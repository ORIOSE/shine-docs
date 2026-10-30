import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Flame, Home, Play, Sprout, TrendingUp } from "lucide-react";
import { AreaChip, Badge, Button, Card, EmptyState, LevelChip, ProgressBar } from "@/components/shine/ui";
import type { AreaId } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alumno")({
  head: () => ({
    meta: [
      { title: "Inicio del alumno · Shine" },
      { name: "description", content: "Qué hago hoy: sesiones, racha y progreso en Shine." },
      { property: "og:title", content: "Inicio del alumno · Shine" },
      { property: "og:description", content: "Qué hago hoy: sesiones, racha y progreso en Shine." },
    ],
  }),
  component: StudentDashboard,
});

type Mode = "datos" | "primer" | "vacio" | "carga";
interface S { id: string; title: string; desc: string; area: AreaId; level: number; done: number; total: number }
const SESSIONS: S[] = [
  { id: "1", title: "Sonidos que riman", desc: "Juega con rimas y descubre qué palabras suenan parecido.", area: "fon", level: 7, done: 7, total: 10 },
  { id: "2", title: "Detective de letras", desc: "Encuentra la letra escondida entre otras muy parecidas.", area: "vis", level: 5, done: 3, total: 8 },
  { id: "3", title: "Cadena de palabras", desc: "Recuerda las palabras en orden y añade una más cada vez.", area: "mem", level: 4, done: 6, total: 6 },
  { id: "4", title: "Lee a tu ritmo", desc: "Un cuento corto para leer en voz alta, sin prisa.", area: "flu", level: 5, done: 0, total: 5 },
];

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? "¡Buenos días" : h < 20 ? "¡Buenas tardes" : "¡Buenas noches";
}

function StudentDashboard() {
  const [mode, setMode] = useState<Mode>("datos");
  const [hello, setHello] = useState("¡Hola");
  useEffect(() => setHello(greeting()), []);
  const first = mode === "primer";
  const sessions = mode === "vacio" ? [] : SESSIONS.map((s) => (first ? { ...s, done: 0 } : s));
  const current = !first ? sessions.find((s) => s.done > 0 && s.done < s.total) : undefined;

  return (
    <div className="min-h-screen pb-28">
      <div className="no-print border-b border-line bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-xl flex-wrap items-center gap-2">
          <Link to="/panel" className="flex min-h-12 items-center gap-1 font-semibold text-teal-dark"><ArrowLeft className="size-5" />Panel</Link>
          <span className="label-text ml-auto">Estado demo</span>
          {(["datos", "primer", "vacio", "carga"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} className={cn("h-10 rounded-full border-[1.5px] px-3 text-sm font-semibold", mode === m ? "border-teal bg-teal-tint text-teal-dark" : "border-line")}>
              {{ datos: "Con datos", primer: "Primer uso", vacio: "Vacío", carga: "Carga" }[m]}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
        {mode === "carga" ? <Skeletons /> : (
          <>
            <section className="flex flex-col gap-2 rounded-lg bg-teal-tint p-5">
              <h1>{hello}, Lucía!</h1>
              {!first && <p>Esta semana: 5 actividades, 24 minutos</p>}
              {!first && <span className="flex w-fit items-center gap-2 rounded-full bg-surface px-3 py-1 font-bold text-amber-dark"><Flame className="size-5 text-amber" aria-hidden />3 días seguidos</span>}
              {first && <p>Qué bien tenerte aquí. Elige una sesión para empezar.</p>}
            </section>

            {current && (
              <Card className="flex flex-col gap-4 p-5 shadow-raised">
                <span className="label-text">Continuar donde lo dejaste</span>
                <h2>{current.title}</h2>
                <ProgressBar value={current.done} max={current.total} label={`${current.done} de ${current.total} actividades`} />
                <Button><Play />Continuar</Button>
              </Card>
            )}

            <section className="flex flex-col gap-3">
              <h2>Sesiones</h2>
              {sessions.length === 0 ? (
                <Card><EmptyState icon={Sprout} title="Todavía no tienes sesiones" message="Vuelve pronto. Tu profe o tu familia te preparará una muy pronto." /></Card>
              ) : sessions.map((s) => {
                const complete = s.done === s.total;
                return (
                  <Card key={s.id} pressable className="flex flex-col gap-3 hover:bg-teal-tint" role="link" tabIndex={0}>
                    <div className="flex items-start justify-between gap-3">
                      <h2>{s.title}</h2>
                      {complete && <Badge tone="success" icon={CheckCircle2}>Completada</Badge>}
                    </div>
                    <p className="line-clamp-2 text-ink-muted">{s.desc}</p>
                    <div className="flex flex-wrap gap-2"><AreaChip area={s.area} /><LevelChip level={s.level} /></div>
                    <ProgressBar value={s.done} max={s.total} label={`${s.done} de ${s.total} actividades`} />
                  </Card>
                );
              })}
            </section>
          </>
        )}
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 border-t border-line bg-surface" aria-label="Navegación de la app">
        <div className="mx-auto grid max-w-xl grid-cols-2">
          <a href="#" aria-current="page" className="flex min-h-16 flex-col items-center justify-center font-bold text-teal-dark"><Home className="size-6" strokeWidth={2.25} />Inicio</a>
          <a href="#" className="flex min-h-16 flex-col items-center justify-center font-semibold text-ink-muted"><TrendingUp className="size-6" />Mi progreso</a>
        </div>
      </nav>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="flex flex-col gap-4" aria-busy aria-label="Cargando">
      <div className="h-28 rounded-lg bg-shell" />
      {[0, 1, 2].map((i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="h-6 w-1/2 rounded-sm bg-shell" />
          <div className="h-4 w-full rounded-sm bg-shell" />
          <div className="flex gap-2"><div className="h-8 w-32 rounded-full bg-shell" /><div className="h-8 w-28 rounded-full bg-shell" /></div>
          <div className="h-3 w-full rounded-full bg-track" />
        </Card>
      ))}
    </div>
  );
}
