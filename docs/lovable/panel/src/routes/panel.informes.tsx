import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { AreaLineChart, LevelDistributionChart } from "@/components/shine/charts";
import { AreaChip, Button, Card, Field, LevelChip, PageHeader, Select, Tabs, Textarea, Wordmark } from "@/components/shine/ui";
import { AREAS, DIFFICULT, GABINETE, CENTRO, STUDENTS, getStudent, historyFor, levelBandName, weeklySeries } from "@/data/report";
import { can, useShine } from "@/lib/shine-context";

export const Route = createFileRoute("/panel/informes")({
  validateSearch: (s: Record<string, unknown>): { alumno?: string } => (typeof s["alumno"] === "string" ? { alumno: s["alumno"] } : {}),
  head: () => ({
    meta: [
      { title: "Informes · Shine" },
      { name: "description", content: "Genera informes imprimibles de alumnos y de organización." },
      { property: "og:title", content: "Informes · Shine" },
      { property: "og:description", content: "Genera informes imprimibles de alumnos y de organización." },
    ],
  }),
  component: Informes,
});

function Informes() {
  const { role } = useShine();
  const [tab, setTab] = useState<"alumno" | "org">("alumno");
  const coord = can.isCoord(role);
  return (
    <>
      <PageHeader title="Informes" subtitle="Prepara un informe, revísalo y descárgalo en PDF." />
      {coord && <Tabs tabs={[{ id: "alumno", label: "Informe de alumno" }, { id: "org", label: "Informe de organización" }]} value={tab} onChange={setTab} />}
      {tab === "alumno" || !coord ? <StudentReport /> : <OrgReport />}
    </>
  );
}

function csv(name: string) {
  const rows = [["alumno", "sesiones", "ultimas4", ...AREAS.map((a) => a.id)], ...STUDENTS.map((s) => [s.name, s.total, s.last4, ...AREAS.map((a) => s.levels[a.id])])];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.map((r) => r.join(";")).join("\n")], { type: "text/csv" }));
  a.download = name;
  a.click();
}

function StudentReport() {
  const search = Route.useSearch();
  const { role } = useShine();
  const [id, setId] = useState(search.alumno ?? "lucia");
  const [period, setPeriod] = useState("Últimas 12 semanas");
  const [obs, setObs] = useState("Lucía mantiene un ritmo constante. Recomendamos seguir con dos sesiones cortas en casa.");
  const s = getStudent(id)!;
  const h = historyFor(s);
  const org = role === "centro" ? CENTRO.name : GABINETE.name;
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="no-print flex h-fit flex-col gap-4">
        <Field label="Alumno">{(i) => <Select id={i} value={id} onChange={(e) => setId(e.target.value)}>{STUDENTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>}</Field>
        <Field label="Periodo">{(i) => <Select id={i} value={period} onChange={(e) => setPeriod(e.target.value)}><option>Últimas 4 semanas</option><option>Últimas 12 semanas</option><option>Este curso</option></Select>}</Field>
        <Field label="Observaciones">{(i) => <Textarea id={i} value={obs} onChange={(e) => setObs(e.target.value)} />}</Field>
        <Button onClick={() => window.print()}><Printer />Descargar PDF</Button>
        <Button variant="secondary" onClick={() => csv("cartera.csv")}><FileSpreadsheet />Informe de cartera CSV</Button>
      </Card>
      <Card className="print-area flex flex-col gap-6 p-8">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div><h1>Informe de {s.name}</h1><p className="text-ink-muted">{period} · {org}</p></div>
          <div className="flex flex-col items-end"><span className="font-extrabold">{org}</span><span className="label-text">con</span><Wordmark /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><span className="label-text">Sesiones</span><p className="stat-num">{s.total}</p></div>
          <div><span className="label-text">Últimas 4 semanas</span><p className="stat-num">{s.last4}</p></div>
          <div><span className="label-text">Responsable</span><p className="font-bold">{s.owner}</p></div>
        </div>
        <section>
          <h2 className="mb-2">Niveles por área</h2>
          <table className="w-full text-base">
            <thead><tr className="label-text"><th className="py-2 text-left">Área</th><th className="text-left">Inicio</th><th className="text-left">Final</th></tr></thead>
            <tbody>{AREAS.map((a) => <tr key={a.id} className="h-14 border-t border-line"><td><AreaChip area={a.id} /></td><td><LevelChip level={h[a.id][0] ?? 1} compact /></td><td><LevelChip level={h[a.id][11] ?? 1} compact /></td></tr>)}</tbody>
          </table>
        </section>
        <section><h2 className="mb-2">Evolución</h2><AreaLineChart data={weeklySeries(h)} height={240} /></section>
        <section>
          <h2 className="mb-2">Actividades que le han costado más</h2>
          <ul className="flex flex-col gap-2">{DIFFICULT.map((d) => <li key={d.name} className="rounded-md bg-amber-tint p-3 text-base"><b>{d.name}</b> · {d.text}</li>)}</ul>
        </section>
        <section><h2 className="mb-2">Observaciones</h2><p>{obs}</p></section>
      </Card>
    </div>
  );
}

function OrgReport() {
  const active = STUDENTS.filter((s) => s.status !== "archivado");
  const dist = AREAS.map((a) => {
    const c = { area: a.short, Inicial: 0, Intermedio: 0, Avanzado: 0 };
    active.forEach((s) => { c[levelBandName(s.levels[a.id])]++; });
    return c;
  });
  return (
    <div className="flex flex-col gap-6">
      <Card className="no-print flex flex-wrap items-end gap-4">
        <Field label="Periodo">{(i) => <Select id={i} className="w-56"><option>Este trimestre</option><option>Este curso</option></Select>}</Field>
        <Button onClick={() => window.print()}><Printer />Descargar PDF</Button>
        <Button variant="secondary" onClick={() => csv("organizacion.csv")}><Download />Descargar CSV</Button>
      </Card>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Alumnos", active.length], ["Sesiones", 489], ["Nivel medio", "5,8"], ["Docentes activos", 4]].map(([l, v]) => <Card key={l}><span className="label-text">{l}</span><p className="stat-num">{v}</p></Card>)}
      </div>
      <Card><h2 className="mb-3">Distribución de niveles por área</h2><LevelDistributionChart data={dist} /></Card>
      <Card>
        <h2 className="mb-3">Uso por docente</h2>
        <table className="w-full text-base">
          <thead><tr className="label-text"><th className="py-2 text-left">Persona</th><th className="text-left">Alumnos</th><th className="text-left">Sesiones</th></tr></thead>
          <tbody>{[["Marta R.", 6, 182], ["Jordi P.", 4, 121], ["Elena S.", 4, 104], ["Pere V.", 0, 0]].map((r) => <tr key={r[0]} className="h-14 border-t border-line">{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
