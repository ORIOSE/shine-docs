import { useState } from "react";
import { Ban, Copy, Download, FileUp, KeyRound, Plus, ShieldCheck, UserCog, UserMinus } from "lucide-react";
import { DataTable } from "./DataTable";
import { Alert, Avatar, Badge, Button, Card, Field, Input, Modal, ProgressBar, Select, StatusBadge, Textarea } from "./ui";
import { ACCESS_LOG, AREAS, CENTRO, GROUPS, INVITE_CODES, MEMBERS, STUDENTS, lastSessionLabel, type Member } from "@/data/mock";
import { useShine } from "@/lib/shine-context";

export function MembersSection() {
  const { toast } = useShine();
  const [codes, setCodes] = useState(INVITE_CODES);
  const [gen, setGen] = useState(false);
  const [remove, setRemove] = useState<Member | null>(null);
  const [staff, setStaff] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setGen(true)}><KeyRound />Generar código de invitación</Button>
        <Button variant="secondary" onClick={() => setStaff(true)}><ShieldCheck />Dar acceso a un alumno</Button>
      </div>
      <DataTable
        rows={MEMBERS}
        searchText={(m) => m.name}
        columns={[
          { key: "n", header: "Nombre", sort: (m) => m.name, render: (m) => <span className="flex items-center gap-3 font-semibold"><Avatar name={m.name} size={32} />{m.name}</span> },
          { key: "r", header: "Rol", sort: (m) => m.role, render: (m) => <Select aria-label={`Rol de ${m.name}`} defaultValue={m.role} className="h-10 w-44 text-base" onChange={() => toast("Rol actualizado")}><option>Coordinadora</option><option>Profesional</option><option>Docente</option></Select> },
          { key: "s", header: "Alta", render: (m) => m.since },
          { key: "a", header: "Alumnos a cargo", sort: (m) => m.students, render: (m) => m.students },
          { key: "l", header: "Última actividad", render: (m) => m.lastActive },
          { key: "x", header: "", render: (m) => <Button size="sm" variant="ghost" onClick={() => setRemove(m)}><UserMinus />Dar de baja</Button> },
        ]}
        mobileCard={(m) => <Card className="flex items-center gap-3"><Avatar name={m.name} /><div className="flex-1"><h3>{m.name}</h3><span className="label-text">{m.role} · {m.students} alumnos · {m.lastActive}</span></div><Button size="sm" variant="ghost" onClick={() => setRemove(m)}>Dar de baja</Button></Card>}
      />
      <Card>
        <h2 className="mb-3">Códigos vigentes</h2>
        <ul className="divide-y divide-line">
          {codes.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center gap-4 py-3">
              <code className="font-bold">{c.code}</code><Badge tone="teal">{c.role}</Badge>
              <span className="label-text">Usos {c.uses} · caduca {c.expires}</span>
              <span className="ml-auto flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast("Código copiado")}><Copy />Copiar</Button>
                <Button size="sm" variant="ghost" onClick={() => { setCodes(codes.filter((x) => x.code !== c.code)); toast("Código revocado"); }}><Ban />Revocar</Button>
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={gen} onClose={() => setGen(false)} title="Nuevo código de invitación" footer={<Button onClick={() => { setCodes([...codes, { code: `APREN-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, role: "Profesional", uses: "0 de 5", expires: "30 dic 2026" }]); setGen(false); toast("Código creado"); }}>Generar</Button>}>
        <Field label="Rol">{(id) => <Select id={id}><option>Profesional</option><option>Docente</option><option>Coordinador</option></Select>}</Field>
        <Field label="Usos máximos">{(id) => <Input id={id} type="number" defaultValue={5} min={1} />}</Field>
        <Field label="Caduca el">{(id) => <Input id={id} type="date" defaultValue="2026-12-30" />}</Field>
      </Modal>
      <Modal open={!!remove} onClose={() => setRemove(null)} title={`Dar de baja a ${remove?.name ?? ""}`} footer={<><Button variant="secondary" onClick={() => setRemove(null)}>Cancelar</Button><Button onClick={() => { setRemove(null); toast("Miembro dado de baja"); }}>Dar de baja</Button></>}>
        <Alert tone="warning" title={`Sus ${remove?.students ?? 0} alumnos quedarán «sin responsable»`}>Podrás reasignarlos desde la pestaña Alumnos. No se pierde ningún dato.</Alert>
      </Modal>
      <Modal open={staff} onClose={() => setStaff(false)} title="Dar acceso a un alumno" footer={<Button onClick={() => { setStaff(false); toast("Acceso concedido"); }}>Dar acceso</Button>}>
        <Field label="Miembro">{(id) => <Select id={id}>{MEMBERS.map((m) => <option key={m.id}>{m.name}</option>)}</Select>}</Field>
        <Field label="Alumno">{(id) => <Select id={id}>{STUDENTS.map((s) => <option key={s.id}>{s.name}</option>)}</Select>}</Field>
      </Modal>
    </div>
  );
}

export function OrgStudentsSection() {
  const { toast } = useShine();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [bulk, setBulk] = useState(false);
  const [csv, setCsv] = useState(false);
  const [file, setFile] = useState<string[][] | null>(null);
  const [ok, setOk] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setCsv(true)}><FileUp />Alta masiva por CSV</Button>
        <Button variant="secondary" onClick={() => setBulk(true)}><UserMinus />Liberación de fin de curso</Button>
      </div>
      <DataTable
        rows={STUDENTS}
        selectable selected={sel} onSelect={setSel}
        searchText={(s) => s.name + s.owner}
        toolbar={sel.size > 0 && <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => toast("Responsable actualizado")}><UserCog />Reasignar responsable</Button><Button size="sm" variant="secondary" onClick={() => toast(`${sel.size} plazas liberadas`)}>Liberar de la licencia</Button></div>}
        columns={[
          { key: "n", header: "Nombre", sort: (s) => s.name, render: (s) => <span className="font-semibold">{s.name}</span> },
          { key: "o", header: "Responsable", sort: (s) => s.owner, render: (s) => s.owner },
          { key: "g", header: "Grupo", sort: (s) => s.group ?? "", render: (s) => s.group },
          { key: "f", header: "Familia", render: (s) => s.family === "vinculada" ? <Badge tone="success">Sí</Badge> : s.family === "pendiente" ? <Badge tone="amber">Pendiente</Badge> : <Badge>No</Badge> },
          { key: "l", header: "Última sesión", sort: (s) => s.daysSince, render: (s) => lastSessionLabel(s.daysSince) },
          { key: "cc", header: "Centro / casa", render: (s) => `${s.centerSessions} / ${s.homeSessions}` },
          { key: "lv", header: "Niveles", render: (s) => <span className="flex gap-1">{AREAS.map((a) => <span key={a.id} title={a.name} className="rounded-sm bg-shell px-2 text-sm font-bold">{a.short.slice(0, 3)} {s.levels[a.id]}</span>)}</span> },
          { key: "st", header: "Estado", render: (s) => <StatusBadge status={s.status} /> },
        ]}
        mobileCard={(s) => <Card className="flex flex-col gap-2"><h3>{s.name}</h3><span className="label-text">{s.owner} · {s.group} · {lastSessionLabel(s.daysSince)}</span><StatusBadge status={s.status} /></Card>}
      />
      <Modal open={bulk} onClose={() => setBulk(false)} title="Liberación de fin de curso" footer={<><Button variant="secondary" onClick={() => setBulk(false)}>Cancelar</Button><Button disabled={ok !== "LIBERAR"} onClick={() => { setBulk(false); toast("47 plazas liberadas"); }}>Liberar todas</Button></>}>
        <p>Se liberarán las plazas de todos los alumnos del centro. Las familias vinculadas conservan el historial y pueden seguir con su propio plan.</p>
        <Field label="Escribe LIBERAR para confirmar">{(id) => <Input id={id} value={ok} onChange={(e) => setOk(e.target.value)} />}</Field>
      </Modal>
      <Modal open={csv} onClose={() => { setCsv(false); setFile(null); }} title="Alta masiva por CSV" footer={<Button disabled={!file} onClick={() => { setCsv(false); toast(`${(file?.length ?? 1) - 1} alumnos dados de alta`); setFile(null); }}>Dar de alta</Button>}>
        <p className="text-base">Columnas: nombre;grupo;responsable. Sin edad ni email.</p>
        <Field label="Archivo CSV">{(id) => <Input id={id} type="file" accept=".csv" className="pt-2.5" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setFile((await f.text()).trim().split(/\r?\n/).map((l) => l.split(/[;,]/))); }} />}</Field>
        <Button size="sm" variant="ghost" onClick={() => setFile([["nombre", "grupo", "responsable"], ["Bruno", "3.º A", "Núria F."], ["Júlia", "4.º B", "Albert G."]])}>Usar ejemplo</Button>
        {file && <table className="w-full text-base"><tbody>{file.slice(0, 6).map((r, i) => <tr key={i} className={i === 0 ? "label-text" : "h-12 border-t border-line"}>{r.map((c, j) => <td key={j} className="pr-3">{c}</td>)}</tr>)}</tbody></table>}
      </Modal>
    </div>
  );
}

export function GroupsSection({ readOnly }: { readOnly?: boolean }) {
  const { toast } = useShine();
  const [groups, setGroups] = useState(GROUPS);
  const [n, setN] = useState(false);
  const list = readOnly ? groups.slice(0, 1) : groups;
  return (
    <div className="flex flex-col gap-4">
      {!readOnly && <Button className="w-fit" onClick={() => setN(true)}><Plus />Crear grupo</Button>}
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((g) => (
          <Card key={g.id} className="flex flex-col gap-3">
            <h2>{g.name}</h2>
            <span className="label-text">Docente: {g.teacher}</span>
            <div className="flex flex-wrap gap-2">{g.students.map((s) => <Badge key={s} tone="teal">{s}</Badge>)}</div>
            {!readOnly && <Button size="sm" variant="secondary" onClick={() => toast("Cambios guardados")}>Editar alumnos</Button>}
          </Card>
        ))}
      </div>
      <Modal open={n} onClose={() => setN(false)} title="Crear grupo" footer={<Button onClick={() => { setGroups([...groups, { id: String(Date.now()), name: "Nuevo grupo", teacher: "Sin asignar", students: [] }]); setN(false); toast("Grupo creado"); }}>Crear</Button>}>
        <Field label="Nombre">{(id) => <Input id={id} placeholder="Ej. 6.º B" />}</Field>
        <Field label="Docente">{(id) => <Select id={id}><option>Núria F.</option><option>Albert G.</option><option>Sílvia M.</option><option>Pau C.</option></Select>}</Field>
      </Modal>
    </div>
  );
}

export function LicenseSection({ centro }: { centro: boolean }) {
  const { toast } = useShine();
  if (!centro) return <Alert title="La licencia del gabinete se gestiona como la profesional">Ve a Licencia en tu menú de cuenta para ver plazas, importes y datos fiscales.</Alert>;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="flex flex-col gap-3">
        <h2>Contrato</h2>
        <ProgressBar value={CENTRO.used} max={CENTRO.seats} label={`${CENTRO.used} de ${CENTRO.seats} plazas`} />
        <p className="text-base">Licencia de centro · curso 2026–27 · vigente hasta {CENTRO.ends}</p>
        <p className="text-base"><span className="label-text">Contacto de facturación: </span>administracio@vallparadis.cat</p>
        <Button variant="secondary" className="w-fit" onClick={() => toast("Descargando contrato (demo)")}><Download />Contrato de encargado de tratamiento</Button>
      </Card>
      <Card>
        <h2 className="mb-2">Facturas</h2>
        <ul className="divide-y divide-line">{["Sep 2026 · 1.440 €", "Mar 2026 · 1.440 €"].map((f) => <li key={f} className="flex items-center justify-between py-3">{f}<Button size="sm" variant="ghost" onClick={() => toast("Descargando factura")}><Download />PDF</Button></li>)}</ul>
      </Card>
      <Card className="flex flex-col gap-3 lg:col-span-2">
        <h2>Solicitar ampliación</h2>
        <Field label="Plazas adicionales">{(id) => <Input id={id} type="number" defaultValue={20} className="w-40" />}</Field>
        <Field label="Comentarios">{(id) => <Textarea id={id} />}</Field>
        <Button className="w-fit" onClick={() => toast("Solicitud enviada")}>Enviar solicitud</Button>
      </Card>
    </div>
  );
}

export function PrivacySection() {
  const { toast } = useShine();
  return (
    <div className="flex flex-col gap-4">
      <Alert title="Exportar datos de la organización" action={<Button size="sm" variant="secondary" onClick={() => toast("Exportación en cola. Llegará por email.")}><Download />Exportar</Button>}>Se genera en cola y llega por email a la coordinación.</Alert>
      <Card>
        <h2 className="mb-2">Registro de accesos</h2>
        <ul className="divide-y divide-line">{ACCESS_LOG.map((l) => <li key={l.date} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4"><span className="w-48 label-text">{l.date}</span><span className="font-semibold">{l.who}</span><span>{l.action}</span></li>)}</ul>
      </Card>
    </div>
  );
}
