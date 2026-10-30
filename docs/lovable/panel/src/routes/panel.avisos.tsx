import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CheckCheck, Circle, Hourglass, Info, PartyPopper } from "lucide-react";
import { Button, Card, EmptyState, PageHeader, Toggle } from "@/components/shine/ui";
import { NOTICES } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panel/avisos")({
  head: () => ({
    meta: [
      { title: "Avisos · Shine" },
      { name: "description", content: "Centro de avisos y preferencias de email." },
      { property: "og:title", content: "Avisos · Shine" },
      { property: "og:description", content: "Centro de avisos y preferencias de email." },
    ],
  }),
  component: Avisos,
});

const icons = { trial: Hourglass, info: Info, success: PartyPopper };

function Avisos() {
  const [list, setList] = useState(NOTICES);
  const [prefs, setPrefs] = useState({ semanal: true, prueba: true, liberacion: true, pago: true, novedades: false });
  const labels: Record<keyof typeof prefs, string> = { semanal: "Resumen semanal", prueba: "Prueba a punto de agotarse", liberacion: "Liberación por el centro", pago: "Pago fallido", novedades: "Novedades de Shine" };
  return (
    <>
      <PageHeader title="Avisos" actions={<Button variant="secondary" onClick={() => setList(list.map((n) => ({ ...n, read: true })))}><CheckCheck />Marcar todo como leído</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {list.length === 0 && <EmptyState icon={BellRing} title="Todo al día" message="Cuando haya algo nuevo, te avisaremos aquí." />}
          {list.map((n) => {
            const Icon = icons[n.kind];
            return (
              <Card key={n.id} pressable onClick={() => setList(list.map((x) => (x.id === n.id ? { ...x, read: true } : x)))} className={cn("flex gap-3", !n.read && "bg-teal-tint")}>
                <Icon className="mt-1 size-5 shrink-0 text-teal-dark" aria-hidden />
                <div className="flex-1">
                  <p className="font-bold">{n.title}</p>
                  <p className="text-base">{n.body}</p>
                  <span className="label-text">{n.date}</span>
                </div>
                {!n.read && <span className="flex items-center gap-1 text-sm font-semibold text-teal-dark"><Circle className="size-3 fill-current" />Sin leer</span>}
              </Card>
            );
          })}
        </div>
        <Card className="h-fit">
          <h2 className="mb-2">Emails que quieres recibir</h2>
          {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => <Toggle key={k} label={labels[k]} checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} />)}
        </Card>
      </div>
    </>
  );
}
