import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, LogOut, Trash2 } from "lucide-react";
import { Alert, Button, Card, Field, Input, Modal, PageHeader, Select } from "@/components/shine/ui";
import { ROLE_USER, can, useShine } from "@/lib/shine-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panel/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta · Shine" },
      { name: "description", content: "Datos personales, fuente, privacidad y sesiones." },
      { property: "og:title", content: "Mi cuenta · Shine" },
      { property: "og:description", content: "Datos personales, fuente, privacidad y sesiones." },
    ],
  }),
  component: Cuenta,
});

function Cuenta() {
  const { role, font, setFont, toast } = useShine();
  const [del, setDel] = useState(false);
  const [confirm, setConfirm] = useState("");
  return (
    <>
      <PageHeader title="Mi cuenta" />
      <Card className="flex flex-col gap-4">
        <h2>Datos personales</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre">{(id) => <Input id={id} defaultValue={ROLE_USER[role]} />}</Field>
          <Field label="Email">{(id) => <Input id={id} type="email" defaultValue={`${ROLE_USER[role].toLowerCase()}@ejemplo.com`} />}</Field>
          <Field label="Nueva contraseña">{(id) => <Input id={id} type="password" placeholder="Mínimo 8 caracteres" />}</Field>
          <Field label="Idioma">{(id) => <Select id={id}><option>Español</option><option>Català</option></Select>}</Field>
        </div>
        <Button className="w-fit" onClick={() => toast("Cambios guardados")}>Guardar cambios</Button>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2>Fuente de lectura</h2>
        <p className="text-ink-muted">Se aplica a todo el panel al momento.</p>
        <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Fuente">
          {([["nunito", "Nunito", '"Nunito"'], ["dyslexic", "OpenDyslexic", '"OpenDyslexic"']] as const).map(([v, name, ff]) => (
            <button key={v} role="radio" aria-checked={font === v} onClick={() => setFont(v)} className={cn("press-card flex flex-col gap-2 rounded-lg border-2 p-4 text-left hover:bg-teal-tint", font === v ? "border-teal bg-teal-tint" : "border-line")}>
              <span className="flex items-center gap-2 font-bold">{font === v && <CheckCircle2 className="size-5 text-teal-dark" />}{name}</span>
              <span style={{ fontFamily: ff }}>La luna brilla sobre el bosque tranquilo.</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2>Consentimientos</h2>
        <ul className="flex flex-col gap-2 text-base">
          <li className="flex items-center gap-2"><CheckCircle2 className="size-5 text-success-dark" />Términos de uso · aceptados el 3 mar 2025</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="size-5 text-success-dark" />Política de privacidad · aceptada el 3 mar 2025</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="size-5 text-success-dark" />Tratamiento de datos de menores · aceptado el 3 mar 2025</li>
        </ul>
      </Card>

      <Card className="flex flex-col gap-4">
        <h2>Privacidad y seguridad</h2>
        <Alert title="Exportar mis datos">Preparamos un archivo con todos tus datos. Se genera en cola y te llega por email en unas horas.</Alert>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast("Solicitud recibida. Te llegará por email.")}><Download />Exportar mis datos</Button>
          <Button variant="secondary" onClick={() => toast("Sesiones cerradas en todos los dispositivos")}><LogOut />Cerrar sesión en todos los dispositivos</Button>
          <Button variant="destructive" onClick={() => setDel(true)}><Trash2 />Borrar mi cuenta</Button>
        </div>
      </Card>

      <Modal open={del} onClose={() => setDel(false)} title="Borrar tu cuenta" footer={<><Button variant="secondary" onClick={() => setDel(false)}>Cancelar</Button><Button variant="destructive" disabled={confirm !== "BORRAR"} onClick={() => { setDel(false); toast("Solicitud de borrado registrada"); }}>Borrar cuenta</Button></>}>
        <p>{role === "familia"
          ? "Se borrarán tus datos y los de los alumnos creados por ti. Si algún alumno está cubierto por un centro, seguirá allí y solo perderás tu acceso."
          : can.isCoord(role)
            ? "Antes de borrar tu cuenta, asigna la coordinación a otra persona. Los alumnos de la organización no se borran."
            : "Tus alumnos quedarán sin responsable hasta que la coordinación los reasigne. Sus historiales se conservan."}</p>
        <p>Tienes 30 días para arrepentirte. Escribe BORRAR para confirmar.</p>
        <Field label="Confirmación">{(id) => <Input id={id} value={confirm} onChange={(e) => setConfirm(e.target.value)} />}</Field>
      </Modal>
    </>
  );
}
