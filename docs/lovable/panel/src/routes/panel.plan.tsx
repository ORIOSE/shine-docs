import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Smartphone } from "lucide-react";
import { Alert, Badge, Button, Card, Field, Input, PageHeader, ProgressBar } from "@/components/shine/ui";
import { FAMILY, GABINETE } from "@/data/mock";
import { useShine } from "@/lib/shine-context";

export const Route = createFileRoute("/panel/plan")({
  head: () => ({
    meta: [
      { title: "Plan y licencia · Shine" },
      { name: "description", content: "Estado de tu plan, renovación e historial de cobros." },
      { property: "og:title", content: "Plan y licencia · Shine" },
      { property: "og:description", content: "Estado de tu plan, renovación e historial de cobros." },
    ],
  }),
  component: Plan,
});

function Dl({ items }: { items: [string, React.ReactNode][] }) {
  return <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(([k, v]) => <div key={k}><dt className="label-text">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>;
}

function Plan() {
  const { role } = useShine();
  return role === "familia" ? <FamilyPlan /> : <ProPlan />;
}

function FamilyPlan() {
  const p = FAMILY.plan;
  return (
    <>
      <PageHeader title="Plan" subtitle="Tu suscripción se gestiona desde la tienda donde la contrataste." />
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3"><h2>{p.name}</h2><Badge tone="success">Activo</Badge></div>
        <Dl items={[["Origen", p.origin], ["Importe", p.price], ["Próxima renovación", p.renews], ["Fecha fin", p.ends]]} />
        <a href="https://apps.apple.com/account/subscriptions" target="_blank" rel="noreferrer" className="press inline-flex h-12 w-fit items-center gap-2 rounded-md bg-teal px-6 font-bold text-on-teal"><ExternalLink className="size-5" />Gestionar suscripción</a>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2>Alumnos en prueba</h2>
        <ProgressBar value={3} max={5} label="Olivia: 3 de 5 sesiones de prueba usadas" />
        <Alert title="¿Cómo contratar?" >
          <span className="flex items-start gap-2"><Smartphone className="mt-1 size-5 shrink-0" />Abre Shine en el móvil o la tablet, ve a Ajustes y elige un plan. El cobro lo hace la tienda.</span>
        </Alert>
      </Card>
      <Payments />
    </>
  );
}

function Payments() {
  return (
    <Card>
      <h2 className="mb-3">Historial de cobros</h2>
      <ul className="divide-y divide-line">
        {FAMILY.payments.map((x) => <li key={x.date} className="flex flex-wrap items-center gap-4 py-3"><span className="w-32 label-text">{x.date}</span><span className="flex-1">{x.concept}</span><span className="font-bold">{x.amount}</span><Badge tone="success">{x.status}</Badge></li>)}
      </ul>
    </Card>
  );
}

function ProPlan() {
  const { toast } = useShine();
  return (
    <>
      <PageHeader title="Licencia profesional" actions={<Button onClick={() => toast("Abriendo portal de cliente (demo)")}><ExternalLink />Abrir portal de cliente</Button>} />
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3"><h2>{GABINETE.plan}</h2><Badge tone="success">{GABINETE.payment}</Badge></div>
        <Dl items={[["Asientos", "3 profesionales"], ["Importe", GABINETE.amount], ["Próxima renovación", GABINETE.renews], ["Método", "Tarjeta ···· 4242"]]} />
        <ProgressBar value={GABINETE.used} max={GABINETE.seats} label={`${GABINETE.used} de ${GABINETE.seats} plazas`} />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2>Datos fiscales</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre o razón social">{(id) => <Input id={id} defaultValue="Aprèn Psicopedagogia SL" />}</Field>
          <Field label="NIF">{(id) => <Input id={id} defaultValue="B12345678" />}</Field>
          <Field label="Dirección">{(id) => <Input id={id} defaultValue="Carrer de Mallorca 120, 08036 Barcelona" />}</Field>
        </div>
        <Button variant="secondary" className="w-fit" onClick={() => toast("Datos fiscales guardados")}>Guardar cambios</Button>
      </Card>
      <Payments />
    </>
  );
}
