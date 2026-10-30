import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, CalendarCheck, Clock, ExternalLink, Mail, PauseCircle, Sparkles, TrendingUp, Users, Users2 } from "lucide-react";
import { Alert, AreaChip, Avatar, Badge, Card, MotivationCard, PageHeader, ProgressBar, StatTile, StatusBadge, TrendIndicator, buttonVariants } from "./ui";
import { SessionsBarChart } from "./charts";
import { CENTRO, FAMILY, GABINETE, STUDENTS, WEEKLY_SESSIONS, lastSessionLabel, lowestHighest } from "@/data/mock";
import { ROLE_USER, useShine } from "@/lib/shine-context";

export function FamilyHome() {
  const trial = FAMILY.children.find((c) => c.coverageKind === "prueba");
  return (
    <>
      <PageHeader title={`Hola, ${FAMILY.name} 👋`} subtitle="Aquí tienes cómo van tus peques esta semana." />
      <MotivationCard title="¡5 días seguidos! 🌟">Tu constancia está dando frutos. Mateo ha completado 3 sesiones esta semana.</MotivationCard>
      {trial && (
        <Alert tone="warning" title={`A ${trial.name} le quedan ${trial.trialLeft} sesiones de prueba`} action={<Link to="/panel/plan" className={buttonVariants({ variant: "secondary", size: "sm" })}>Ver opciones</Link>}>
          Puedes contratar un plan desde la app cuando quieras.
        </Alert>
      )}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FAMILY.children.map((c) => (
          <Card key={c.id} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={c.name} size={56} />
              <div>
                <h2>{c.name}</h2>
                <Badge tone={c.coverageKind === "prueba" ? "amber" : c.coverageKind === "sin" ? "neutral" : "teal"}>{c.coverage}</Badge>
              </div>
            </div>
            <dl className="flex flex-col gap-2">
              <div><dt className="label-text">Última sesión</dt><dd>{c.lastSession}</dd></div>
              <div><dt className="label-text">Siguiente paso</dt><dd className="font-semibold">{c.next}</dd></div>
            </dl>
            <div className="mt-auto flex flex-wrap gap-2">
              <Link to="/panel/alumnos/$id" params={{ id: c.id }} className={buttonVariants({ variant: "secondary", size: "sm" })}>Ver progreso</Link>
              <a href="#" className={buttonVariants({ variant: "ghost", size: "sm" })}><ExternalLink />Abrir en la app</a>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

export function ProHome() {
  const { role } = useShine();
  const active = STUDENTS.filter((s) => s.status === "activo");
  const idle = active.filter((s) => s.daysSince > 14);
  return (
    <>
      <PageHeader title={`Hola, ${ROLE_USER[role]} 👋`} subtitle="Así va tu cartera esta semana." actions={<Link to="/panel/alumnos" className={buttonVariants()}>Ver alumnos</Link>} />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile icon={Users} value={active.length} label="Alumnos activos" tone="teal" />
        <StatTile icon={CalendarCheck} value={23} label="Sesiones esta semana" tone="success" />
        <StatTile icon={Clock} value={idle.length} label="Sin actividad en 14 días" tone="amber" />
        <StatTile icon={TrendingUp} value={5} label="Cambios de nivel recientes" tone="teal" />
        <StatTile icon={PauseCircle} value={1} label="En pausa por cupo" tone="amber" />
      </section>
      <Card>
        <h2 className="mb-3">Plazas de tu licencia</h2>
        <ProgressBar value={GABINETE.used} max={GABINETE.seats} label={`${GABINETE.used} de ${GABINETE.seats} plazas usadas`} />
      </Card>
      <section className="flex flex-col gap-3">
        <h2>Necesitan atención</h2>
        {idle.map((s) => (
          <Link key={s.id} to="/panel/alumnos/$id" params={{ id: s.id }}>
            <Card pressable className="flex items-center gap-3 hover:bg-teal-tint">
              <Avatar name={s.name} />
              <p className="flex-1">{s.name} lleva {s.daysSince} días sin practicar. Quizá sea buen momento para animarle.</p>
              <ArrowRight className="size-5 text-teal-dark" aria-hidden />
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}

export function OrgHome() {
  const { role } = useShine();
  const centro = role === "centro";
  const o = centro ? { name: CENTRO.name, seats: CENTRO.seats, used: CENTRO.used, ends: CENTRO.ends, pay: CENTRO.payment } : { name: GABINETE.name, seats: GABINETE.seats, used: GABINETE.used, ends: GABINETE.renews, pay: GABINETE.payment };
  return (
    <>
      <PageHeader title={o.name} subtitle={`Hola, ${ROLE_USER[role]} 👋 Este es el resumen de tu ${centro ? "centro" : "gabinete"}.`} actions={<Link to="/panel/organizacion" className={buttonVariants()}>Gestionar {centro ? "centro" : "gabinete"}</Link>} />
      <div className="flex flex-col gap-3">
        <Alert tone="warning" title="Quedan pocas plazas">{o.seats - o.used} plazas libres. Puedes pedir una ampliación cuando lo necesites.</Alert>
        <Alert title="2 invitaciones pendientes">Pere V. y una familia aún no han aceptado su invitación.</Alert>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-3">
          <h2>Licencia</h2>
          <ProgressBar value={o.used} max={o.seats} label={`${o.used} de ${o.seats} plazas`} />
          <dl className="grid grid-cols-2 gap-2 text-base">
            {centro && <div><dt className="label-text">Grupos</dt><dd className="font-semibold">{CENTRO.groups}</dd></div>}
            <div><dt className="label-text">Vigencia</dt><dd className="font-semibold">Hasta {o.ends}</dd></div>
            <div><dt className="label-text">Pago</dt><dd><Badge tone="success">{o.pay}</Badge></dd></div>
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="mb-2">Sesiones por semana</h2>
          <SessionsBarChart data={WEEKLY_SESSIONS} />
        </Card>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Users} value={o.used} label="Alumnos activos" />
        <StatTile icon={Users2} value={centro ? 4 : 3} label="Miembros activos" tone="success" />
        <StatTile icon={Activity} value={74} label="Sesiones esta semana" tone="teal" />
        <StatTile icon={Clock} value={3} label="Sin actividad en 14 días" tone="amber" />
      </section>
    </>
  );
}

export function TeacherHome() {
  const mine = STUDENTS.filter((s) => s.group === "3.º A" && s.status !== "archivado");
  return (
    <>
      <PageHeader title="Hola, Núria 👋" subtitle="Tus alumnos de Escola Vallparadís." />
      <MotivationCard title="Buen comienzo de semana" icon={Sparkles}>Tu grupo ha hecho 18 sesiones en los últimos 7 días.</MotivationCard>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mine.map((s) => {
          const { low, high } = lowestHighest(s.levels);
          return (
            <Link key={s.id} to="/panel/alumnos/$id" params={{ id: s.id }}>
              <Card pressable className="flex h-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} />
                  <div className="flex-1"><h3>{s.name}</h3><span className="label-text">{lastSessionLabel(s.daysSince)} · {s.group}</span></div>
                  <TrendIndicator trend={s.trend} />
                </div>
                <div className="flex flex-wrap gap-2"><AreaChip area={high[0]} /><AreaChip area={low[0]} /></div>
                <StatusBadge status={s.status} />
              </Card>
            </Link>
          );
        })}
      </section>
      <Alert title="¿Algo no cuadra?" action={<Link to="/panel/ayuda" className={buttonVariants({ variant: "secondary", size: "sm" })}><Mail />Escribir a soporte</Link>}>
        Si falta algún alumno, habla con tu coordinación.
      </Alert>
    </>
  );
}
