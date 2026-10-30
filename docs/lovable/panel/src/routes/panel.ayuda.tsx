import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from "@/components/shine/ui";
import { STUDENTS } from "@/data/mock";
import { useShine } from "@/lib/shine-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panel/ayuda")({
  head: () => ({
    meta: [
      { title: "Ayuda · Shine" },
      { name: "description", content: "Cómo funciona Shine y contacto con soporte." },
      { property: "og:title", content: "Ayuda · Shine" },
      { property: "og:description", content: "Cómo funciona Shine y contacto con soporte." },
    ],
  }),
  component: Ayuda,
});

const FAQ = [
  ["Bloque inicial", "Las primeras sesiones sirven para conocer a cada alumno. Shine propone actividades de todas las áreas y ajusta el nivel de partida."],
  ["Sesiones regulares", "Cada sesión dura entre 10 y 20 minutos y combina actividades de varias áreas. Mejor poco y a menudo que mucho de golpe."],
  ["Ajustes de nivel", "Si una actividad resulta muy fácil o le cuesta varias veces, Shine sube o baja el nivel con suavidad. También hay evaluaciones periódicas."],
  ["Áreas y niveles", "Trabajamos 5 áreas: conciencia fonológica, discriminación visual, memoria de trabajo, ortografía y fluidez lectora. Cada una va del nivel 1 al 10: inicial (1–3), intermedio (4–6) y avanzado (7–10)."],
];

function Ayuda() {
  const [open, setOpen] = useState<number | null>(0);
  const { toast } = useShine();
  return (
    <>
      <PageHeader title="Ayuda" subtitle="Todo lo que necesitas para acompañar con Shine." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2>Cómo funciona</h2>
          {FAQ.map(([q, a], i) => (
            <Card key={q} className="p-0">
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-lg p-4 text-left font-bold hover:bg-teal-tint">
                {q}<ChevronDown className={cn("size-5 shine-t", open === i && "rotate-180")} aria-hidden />
              </button>
              {open === i && <p className="px-4 pb-4">{a}</p>}
            </Card>
          ))}
        </section>
        <Card className="flex h-fit flex-col gap-4">
          <h2>Escribe a soporte</h2>
          <Field label="Asunto">{(id) => <Input id={id} />}</Field>
          <Field label="Alumno relacionado (opcional)">{(id) => <Select id={id}><option value="">Ninguno</option>{STUDENTS.map((s) => <option key={s.id}>{s.name}</option>)}</Select>}</Field>
          <Field label="Mensaje">{(id) => <Textarea id={id} />}</Field>
          <Button className="w-fit" onClick={() => toast("Mensaje enviado. Te responderemos pronto ❤️")}><Send />Enviar</Button>
        </Card>
      </div>
    </>
  );
}
