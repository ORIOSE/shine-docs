import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Archive, Download, KeyRound, Mail, Pencil, RotateCcw, UserPlus, UserMinus } from "lucide-react";
import { DataTable } from "@/components/shine/DataTable";
import { Alert, AreaChip, Avatar, Badge, Button, Card, Field, Input, LevelChip, Modal, PageHeader, ProgressBar, Select, StatusBadge, TrendIndicator, buttonVariants } from "@/components/shine/ui";
import { FAMILY, STUDENTS, lastSessionLabel, lowestHighest, type Student } from "@/data/mock";
import { can, useShine } from "@/lib/shine-context";

export const Route = createFileRoute("/panel/alumnos/")({
  head: () => ({
    meta: [
      { title: "Alumnos · Shine" },
      { name: "description", content: "Lista de alumnos, altas, invitaciones y estado." },
      { property: "og:title", content: "Alumnos · Shine" },
      { property: "og:description", content: "Lista de alumnos, altas, invitaciones y estado." },
    ],
  }),
  component: Alumnos,
});

function Alumnos() {
  const { role } = useShine();
  return role === "familia" ? <FamilyStudents /> : <Portfolio />;
}

function FamilyStudents() {
  const { toast } = useShine();
  const [add, setAdd] = useState(false);
  const [code, setCode] = useState(false);
  return (
    <>
      <PageHeader title="Alumnos" subtitle="Las personas que practican con Shine en tu familia." actions={<><Button variant="secondary" onClick={() => setCode(true)}><KeyRound />Tengo un código del centro</Button><Button onClick={() => setAdd(true)}><UserPlus />Añadir alumno</Button></>} />
      <Card><ProgressBar value={3} max={3} label="3 de 3 alumnos con el Plan Familia" /></Card>
      <div className="grid gap-4 md:grid-cols-2">
        {FAMILY.children.map((c) => (
          <Card key={c.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={c.name} size={48} />
              <div className="flex-1"><h2>{c.name}</h2><Badge tone={c.coverageKind === "prueba" ? "amber" : "teal"}>{c.coverage}</Badge></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/panel/alumnos/$id" params={{ id: c.id }} className={buttonVariants({ variant: "secondary", size: "sm" })}>Ver ficha</Link>
              {c.coverageKind === "centro" ? (
                <Button size="sm" variant="ghost" onClick={() => toast("Has retirado tu acceso a Noa")}><UserMinus />Retirar mi acceso</Button>
              ) : (
                <>
                  <Button size="sm" variant="ghost" onClick={() => toast("Cambios guardados")}><Pencil />Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast(`${c.name} archivado. Puedes restaurarlo cuando quieras.`)}><Archive />Archivar</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Modal open={add} onClose={() => setAdd(false)} title="Añadir alumno" footer={<Button onClick={() => { setAdd(false); toast("Alumno añadido"); }}>Añadir</Button>}>
        <Alert tone="warning" title="Has llegado al cupo de tu plan">Con el Plan Familia puedes tener 3 alumnos. Archiva uno para añadir otro.</Alert>
        <Field label="Nombre o apodo" hint="No hace falta su apellido ni su edad.">{(id) => <Input id={id} />}</Field>
      </Modal>
      <Modal open={code} onClose={() => setCode(false)} title="Código del centro" footer={<Button onClick={() => { setCode(false); toast("Código aceptado"); }}>Vincular</Button>}>
        <p>Tu centro o gabinete te habrá dado un código. Escríbelo para ver el progreso.</p>
        <Field label="Código">{(id) => <Input id={id} placeholder="Ej. VALL-FAM-82KD" />}</Field>
      </Modal>
    </>
  );
}

function familyBadge(f: Student["family"]) {
  if (f === "vinculada") return <Badge tone="success">Sí</Badge>;
  if (f === "pendiente") return <Badge tone="amber" icon={Mail}>Invitación pendiente</Badge>;
  return <Badge>No</Badge>;
}

function Portfolio() {
  const { role, toast } = useShine();
  const nav = useNavigate();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"todos" | Student["status"]>("todos");
  const [invite, setInvite] = useState<Student | null>(null);
  const [add, setAdd] = useState(false);
  const isCoord = can.isCoord(role);
  const rows = STUDENTS.filter((s) => (filter === "todos" ? s.status !== "archivado" : s.status === filter));

  return (
    <>
      <PageHeader title={role === "docente" ? "Mis alumnos" : "Alumnos"} subtitle={`${STUDENTS.filter((s) => s.status === "activo").length} alumnos activos`} actions={<Button onClick={() => setAdd(true)}><UserPlus />Dar de alta</Button>} />
      <DataTable
        rows={rows}
        selectable
        selected={sel}
        onSelect={setSel}
        searchText={(s) => s.name}
        onRowClick={(s) => nav({ to: "/panel/alumnos/$id", params: { id: s.id } })}
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <Select aria-label="Filtrar por estado" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="md:w-48">
              <option value="todos">Activos y en pausa</option>
              <option value="activo">Activos</option>
              <option value="pausa">En pausa</option>
              <option value="archivado">Archivados</option>
            </Select>
            {sel.size > 0 && (
              <>
                <span className="label-text">{sel.size} seleccionados</span>
                <Button size="sm" variant="secondary" onClick={() => { toast(`${sel.size} alumnos archivados`); setSel(new Set()); }}><Archive />Archivar</Button>
                <Button size="sm" variant="secondary" onClick={() => toast("Preparando informe…")}><Download />Exportar informe</Button>
              </>
            )}
          </div>
        }
        columns={[
          { key: "name", header: "Nombre", sort: (s) => s.name, render: (s) => <span className="flex items-center gap-3 font-semibold"><Avatar name={s.name} size={32} />{s.name}</span> },
          ...(isCoord ? [{ key: "owner", header: "Responsable", sort: (s: Student) => s.owner, render: (s: Student) => s.owner }] : []),
          { key: "last", header: "Última sesión", sort: (s) => s.daysSince, render: (s) => lastSessionLabel(s.daysSince) },
          { key: "total", header: "Totales", sort: (s) => s.total, render: (s) => s.total },
          { key: "l4", header: "Últ. 4 sem.", sort: (s) => s.last4, render: (s) => s.last4 },
          { key: "low", header: "Área más baja", render: (s) => { const { low } = lowestHighest(s.levels); return <span className="flex items-center gap-2"><AreaChip area={low[0]} short /><LevelChip level={low[1]} compact /></span>; } },
          { key: "high", header: "Área más alta", render: (s) => { const { high } = lowestHighest(s.levels); return <span className="flex items-center gap-2"><AreaChip area={high[0]} short /><LevelChip level={high[1]} compact /></span>; } },
          { key: "trend", header: "Tendencia", sort: (s) => s.trend, render: (s) => <TrendIndicator trend={s.trend} /> },
          { key: "status", header: "Estado", sort: (s) => s.status, render: (s) => <StatusBadge status={s.status} /> },
          {
            key: "fam", header: "Familia", sort: (s) => s.family,
            render: (s) => s.family === "no" ? <button className="font-semibold text-teal-dark hover:underline" onClick={(e) => { e.stopPropagation(); setInvite(s); }}>Invitar</button> : familyBadge(s.family),
          },
        ]}
        mobileCard={(s) => {
          const { low, high } = lowestHighest(s.levels);
          return (
            <Card pressable className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div className="flex-1"><h3>{s.name}</h3><span className="label-text">{lastSessionLabel(s.daysSince)} · {s.total} sesiones</span></div>
                <TrendIndicator trend={s.trend} />
              </div>
              <div className="flex flex-wrap gap-2"><AreaChip area={high[0]} short /><LevelChip level={high[1]} compact /><AreaChip area={low[0]} short /><LevelChip level={low[1]} compact /></div>
              <div className="flex flex-wrap gap-2"><StatusBadge status={s.status} />{familyBadge(s.family)}</div>
            </Card>
          );
        }}
      />
      {filter === "archivado" && <p className="label-text"><RotateCcw className="mr-1 inline size-4" />Abre la ficha de un alumno archivado para restaurarlo.</p>}
      <InviteFamilyModal student={invite} onClose={() => setInvite(null)} />
      <Modal open={add} onClose={() => setAdd(false)} title="Dar de alta un alumno" footer={<Button onClick={() => { setAdd(false); toast("Alumno dado de alta"); }}>Dar de alta</Button>}>
        <ProgressBar value={14} max={20} label="14 de 20 plazas usadas · ocupará 1 plaza" />
        <Field label="Nombre o apodo" hint="Solo nombre o apodo. No guardamos edad ni email del alumno.">{(id) => <Input id={id} />}</Field>
      </Modal>
    </>
  );
}

export function InviteFamilyModal({ student, onClose }: { student: Student | null; onClose: () => void }) {
  const { toast } = useShine();
  const code = student ? `FAM-${student.id.toUpperCase().slice(0, 4)}-${(student.total * 37).toString(36).toUpperCase()}` : "";
  return (
    <Modal open={!!student} onClose={onClose} title={`Invitar a la familia de ${student?.name ?? ""}`} footer={<Button onClick={() => { onClose(); toast("Invitación enviada"); }}><Mail />Enviar invitación</Button>}>
      <p>Comparte este código o el QR. La familia podrá ver el progreso desde su cuenta.</p>
      <div className="flex items-center gap-4 rounded-lg bg-teal-tint p-4">
        <MockQR seed={code} />
        <div>
          <span className="label-text">Código</span>
          <p className="text-2xl font-extrabold tracking-wide">{code}</p>
          <Badge tone="amber">Estado: sin enviar</Badge>
        </div>
      </div>
      <Field label="Email de la familia">{(id) => <Input id={id} type="email" placeholder="familia@ejemplo.com" />}</Field>
    </Modal>
  );
}

function MockQR({ seed }: { seed: string }) {
  let h = 0;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const cells = Array.from({ length: 121 }, (_, i) => {
    const x = i % 11, y = Math.floor(i / 11);
    const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
    if (finder) return !(x % 10 === 1 && y % 10 === 1) || true;
    h = (h * 1103515245 + 12345) >>> 0;
    return (h >> 16) % 2 === 0;
  });
  return (
    <div role="img" aria-label="Código QR de invitación" className="grid size-24 shrink-0 grid-cols-11 gap-px rounded-sm bg-surface p-1.5">
      {cells.map((on, i) => <span key={i} className={on ? "bg-ink" : "bg-surface"} />)}
    </div>
  );
}
