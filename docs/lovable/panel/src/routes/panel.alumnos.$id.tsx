import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, ChevronDown, Download, FileText, History, Layers, ListChecks, Lock, MapPin, NotebookPen, Plus, RotateCcw, UserCog, UserMinus, UserPlus, Users } from "lucide-react";
import { AreaLineChart } from "@/components/shine/charts";
import { Alert, AreaChip, Avatar, Badge, Button, Card, EmptyState, Field, Input, LevelChip, Modal, PageHeader, Select, StatusBadge, Tabs, Textarea, Toggle, TrendIndicator, AREA_ICON } from "@/components/shine/ui";
import { InviteFamilyModal } from "./panel.alumnos.index";
import { AREAS, DIFFICULT, LEVEL_CHANGES, LUCIA_NOTES, LUCIA_SESSIONS, getStudent, historyFor, lastSessionLabel, weeklySeries, type Note, type Student } from "@/data/mock";
import { can, useShine } from "@/lib/shine-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panel/alumnos/$id")({
  loader: ({ params }) => {
    const s = getStudent(params.id);
    if (!s) throw notFound();
    return { student: s };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.student.name} · Ficha de alumno · Shine` : "Ficha de alumno · Shine";
    return { meta: [{ title: t }, { name: "description", content: "Niveles, sesiones y rendimiento del alumno." }, { property: "og:title", content: t }, { property: "og:description", content: "Niveles, sesiones y rendimiento del alumno." }] };
  },
  component: Ficha,
});

type Tab = "niveles" | "sesiones" | "rendimiento" | "notas" | "exportar";

function Ficha() {
  const { student: s } = Route.useLoaderData();
  const { role, toast } = useShine();
  const [tab, setTab] = useState<Tab>("niveles");
  const [invite, setInvite] = useState(false);
  const [release, setRelease] = useState(false);
  const [reassign, setReassign] = useState(false);
  const coverage = role === "familia" ? (s.id === "noa" ? "Centro Escola Vallparadís" : s.id === "olivia" ? "Prueba · 2 sesiones restantes" : "Plan Familia") : "Gabinete Aprèn";

  const tabs: { id: Tab; label: string; icon: typeof Layers }[] = [
    { id: "niveles", label: "Niveles", icon: Layers },
    { id: "sesiones", label: "Sesiones", icon: ListChecks },
    { id: "rendimiento", label: "Rendimiento", icon: BarChart3 },
    ...(can.notes(role) ? [{ id: "notas" as Tab, label: "Notas", icon: NotebookPen }] : []),
    { id: "exportar", label: "Exportar", icon: Download },
  ];

  return (
    <>
      <Link to="/panel/alumnos" className="no-print w-fit font-semibold text-teal-dark hover:underline">← Volver a alumnos</Link>
      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Avatar name={s.name} size={72} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3"><h1>{s.name}</h1><StatusBadge status={s.status} /><TrendIndicator trend={s.trend} /></div>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-base">
            <span><span className="label-text">Cobertura: </span>{coverage}</span>
            <span><span className="label-text">Responsable: </span>{s.owner}</span>
            <span><span className="label-text">Otros adultos: </span>Laura (familia){s.family === "pendiente" ? ", invitación pendiente" : ""}</span>
            <span><span className="label-text">Última sesión: </span>{lastSessionLabel(s.daysSince)}</span>
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          {can.invite(role) && s.family !== "vinculada" && <Button size="sm" onClick={() => setInvite(true)}><UserPlus />Invitar a la familia</Button>}
          {can.members(role) && <Button size="sm" variant="secondary" onClick={() => setReassign(true)}><UserCog />Reasignar</Button>}
          {can.invite(role) && role !== "docente" && <Button size="sm" variant="secondary" onClick={() => setRelease(true)}><UserMinus />Liberar</Button>}
          {s.status === "archivado" && can.edit(role) && <Button size="sm" variant="secondary" onClick={() => toast(`${s.name} restaurado`)}><RotateCcw />Restaurar</Button>}
        </div>
      </Card>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === "niveles" && <LevelsTab s={s} />}
      {tab === "sesiones" && <SessionsTab s={s} />}
      {tab === "rendimiento" && <PerformanceTab s={s} />}
      {tab === "notas" && <NotesTab s={s} />}
      {tab === "exportar" && <ExportTab s={s} />}

      <InviteFamilyModal student={invite ? s : null} onClose={() => setInvite(false)} />
      <Modal open={release} onClose={() => setRelease(false)} title={`Liberar a ${s.name}`} footer={<><Button variant="secondary" onClick={() => setRelease(false)}>Cancelar</Button><Button onClick={() => { setRelease(false); toast("Plaza liberada"); }}>Liberar plaza</Button></>}>
        <p>Se liberará su plaza. Su historial se conserva y la familia vinculada podrá seguir usando Shine con su propio plan o la prueba gratuita.</p>
      </Modal>
      <Modal open={reassign} onClose={() => setReassign(false)} title="Reasignar responsable" footer={<Button onClick={() => { setReassign(false); toast("Responsable actualizado"); }}>Guardar</Button>}>
        <Field label="Nuevo responsable">{(id) => <Select id={id} defaultValue={s.owner}><option>Marta R.</option><option>Jordi P.</option><option>Elena S.</option><option>Pere V.</option></Select>}</Field>
      </Modal>
    </>
  );

}

  function LevelsTab({ s }: { s: Student }) {
    const { toast } = useShine(); void toast;
    const h = historyFor(s);
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {AREAS.map((a) => {
            const Icon = AREA_ICON[a.id];
            return (
              <Card key={a.id} className="flex flex-col gap-3">
                <span className="flex items-center gap-2 font-bold"><Icon className="size-5 text-teal-dark" aria-hidden />{a.name}</span>
                <LevelChip level={s.levels[a.id]} />
                {a.id === "mem" && <span className="label-text">Sondeo: nivel 5</span>}
                <span className="label-text">Última evaluación: 20 oct</span>
                <span className="label-text">Evidencia: {8 + s.levels[a.id]} actividades</span>
              </Card>
            );
          })}
        </div>
        <Card><h2 className="mb-3">Evolución en 12 semanas</h2><AreaLineChart data={weeklySeries(h)} /></Card>
        <Card>
          <h2 className="mb-3 flex items-center gap-2"><History className="size-5" aria-hidden />Historial de cambios</h2>
          <ul className="divide-y divide-line">
            {LEVEL_CHANGES.map((c, i) => (
              <li key={i} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                <span className="w-20 label-text">{c.date}</span>
                <AreaChip area={c.area} />
                <span className="flex-1 text-base">{c.from ? `De ${c.from} a ${c.to}` : `Empieza en ${c.to}`}</span>
                <Badge tone="teal">{c.reason}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  function SessionsTab({ s }: { s: Student }) {
    const { toast } = useShine(); void toast;
    const [open, setOpen] = useState<number | null>(null);
    if (s.total === 0) return <EmptyState icon={ListChecks} title="Aún no hay sesiones" message="Cuando empiece una sesión, su progreso aparecerá aquí." />;
    return (
      <div className="flex flex-col gap-3">
        {LUCIA_SESSIONS.map((ss, i) => (
          <Card key={i} className="p-0">
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-h-14 w-full flex-wrap items-center gap-x-6 gap-y-2 rounded-lg p-4 text-left hover:bg-teal-tint">
              <span className="w-28 font-bold">{ss.date}</span>
              <span className="w-44">{ss.type}</span>
              <span className="flex w-28 items-center gap-1 text-base"><MapPin className="size-4" aria-hidden />{ss.where}</span>
              <span className="text-base">{ss.activities} actividades</span>
              <Badge tone={ss.rating === "Me ha costado" ? "amber" : "success"}>{ss.rating}</Badge>
              <span className="text-base text-ink-muted">{ss.minutes} min</span>
              <ChevronDown className={cn("ml-auto size-5 shine-t", open === i && "rotate-180")} aria-hidden />
            </button>
            {open === i && (
              <div className="overflow-x-auto border-t border-line px-4 pb-4">
                <table className="w-full text-base">
                  <thead><tr className="label-text"><th className="py-2 text-left">Actividad</th><th className="text-left">Tiempo</th><th className="text-left">Aciertos</th><th className="text-left">Ritmo</th></tr></thead>
                  <tbody>{ss.detail.map((a) => <tr key={a.name} className="h-12 border-t border-line"><td><span className="flex items-center gap-2"><AreaChip area={a.area} short />{a.name}</span></td><td>{a.time}</td><td>{a.hits}</td><td>{a.pace}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  function PerformanceTab({ s }: { s: Student }) {
    const { toast } = useShine(); void toast;
    const data = LUCIA_SESSIONS.slice().reverse().map((x) => ({ semana: x.date.replace(", ", " "), fon: 7, vis: 5 + (x.minutes % 2), mem: 4, ort: 6 + (x.activities > 4 ? 1 : 0), flu: 5 }));
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <h2 className="mb-1">Actividades que le han costado más</h2>
          <p className="mb-3 text-ink-muted">Es normal. Son buenas pistas de qué reforzar con calma.</p>
          <ul className="flex flex-col gap-3">
            {DIFFICULT.map((d) => (
              <li key={d.name} className="flex flex-col gap-2 rounded-md bg-amber-tint p-4 sm:flex-row sm:items-center">
                <AreaChip area={d.area} />
                <span className="flex-1 font-bold">{d.name}</span>
                <span className="text-base text-amber-dark">{d.text}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card><h2 className="mb-3">Comparativa entre sesiones</h2><AreaLineChart data={data} height={240} /></Card>
      </div>
    );
  }

  function NotesTab({ s }: { s: Student }) {
    const { toast } = useShine(); void toast;
    const [notes, setNotes] = useState<Note[]>(LUCIA_NOTES);
    const [text, setText] = useState("");
    const [share, setShare] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="warning" title="No escribas diagnósticos ni datos de salud en las notas." />
        <Card className="flex flex-col gap-3">
          <Field label="Nueva nota">{(id) => <Textarea id={id} value={text} onChange={(e) => setText(e.target.value)} />}</Field>
          <Toggle checked={share} onChange={setShare} label="Compartir con la familia" />
          <Button className="w-fit" disabled={!text.trim()} onClick={() => { setNotes([{ id: String(Date.now()), date: "Hoy", author: "Marta R.", shared: share, text }, ...notes]); setText(""); setShare(false); toast("Nota guardada"); }}><Plus />Guardar nota</Button>
        </Card>
        {notes.map((n) => (
          <Card key={n.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3"><span className="font-bold">{n.author}</span><span className="label-text">{n.date}</span>{n.shared ? <Badge tone="teal" icon={Users}>Compartida con la familia</Badge> : <Badge icon={Lock}>Solo profesionales</Badge>}</div>
            <p>{n.text}</p>
            <Toggle checked={n.shared} onChange={(v) => setNotes(notes.map((x) => (x.id === n.id ? { ...x, shared: v } : x)))} label="Compartir con la familia" />
          </Card>
        ))}
      </div>
    );
  }

  function ExportTab({ s }: { s: Student }) {
    const { toast } = useShine(); void toast;
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2"><FileText className="size-5" />Informe PDF</h2>
          <Field label="Periodo">{(id) => <Select id={id}><option>Últimas 4 semanas</option><option>Últimas 12 semanas</option><option>Este curso</option></Select>}</Field>
          <Link to="/panel/informes" search={{ alumno: s.id }} className="press inline-flex h-12 w-fit items-center gap-2 rounded-md bg-teal px-6 font-bold text-on-teal">Preparar informe</Link>
        </Card>
        <Card className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2"><Download className="size-5" />Sesiones en CSV</h2>
          <Field label="Desde">{(id) => <Input id={id} type="date" defaultValue="2026-09-01" />}</Field>
          <Button variant="secondary" className="w-fit" onClick={() => downloadCsv(s.name)}>Descargar CSV</Button>
        </Card>
      </div>
    );
  }

export function downloadCsv(name: string) {
  const rows = [["fecha", "tipo", "lugar", "actividades", "valoracion", "minutos"], ...LUCIA_SESSIONS.map((x) => [x.date, x.type, x.where, x.activities, x.rating, x.minutes])];
  const blob = new Blob([rows.map((r) => r.join(";")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sesiones-${name.toLowerCase()}.csv`;
  a.click();
}

