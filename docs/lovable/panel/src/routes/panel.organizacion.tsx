import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CreditCard, FileText, Shield, Users, UsersRound, UserCog } from "lucide-react";
import { GroupsSection, LicenseSection, MembersSection, OrgStudentsSection, PrivacySection } from "@/components/shine/org";
import { EmptyState, PageHeader, Tabs, buttonVariants } from "@/components/shine/ui";
import { CENTRO, GABINETE } from "@/data/mock";
import { can, useShine } from "@/lib/shine-context";

export const Route = createFileRoute("/panel/organizacion")({
  head: () => ({
    meta: [
      { title: "Mi organización · Shine" },
      { name: "description", content: "Miembros, alumnos, grupos, licencia y privacidad de tu organización." },
      { property: "og:title", content: "Mi organización · Shine" },
      { property: "og:description", content: "Miembros, alumnos, grupos, licencia y privacidad de tu organización." },
    ],
  }),
  component: Org,
});

type T = "miembros" | "alumnos" | "grupos" | "licencia" | "privacidad";

function Org() {
  const { role } = useShine();
  const centro = role === "centro";
  const [tab, setTab] = useState<T>("miembros");
  if (!can.members(role)) return <EmptyState icon={Building2} title="Solo para coordinación" message="Cambia a un rol de coordinador en «Ver como» para ver esta sección." />;
  const tabs = [
    { id: "miembros" as T, label: "Miembros", icon: UserCog },
    { id: "alumnos" as T, label: "Alumnos", icon: Users },
    ...(centro ? [{ id: "grupos" as T, label: "Grupos", icon: UsersRound }] : []),
    { id: "licencia" as T, label: "Licencia y facturación", icon: CreditCard },
    { id: "privacidad" as T, label: "Datos y privacidad", icon: Shield },
  ];
  return (
    <>
      <PageHeader title={centro ? CENTRO.name : GABINETE.name} subtitle={centro ? "Mi centro" : "Mi gabinete"} actions={<Link to="/panel/informes" className={buttonVariants({ variant: "secondary" })}><FileText />Informes</Link>} />
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === "miembros" && <MembersSection />}
      {tab === "alumnos" && <OrgStudentsSection />}
      {tab === "grupos" && <GroupsSection />}
      {tab === "licencia" && <LicenseSection centro={centro} />}
      {tab === "privacidad" && <PrivacySection />}
    </>
  );
}
