import { createFileRoute } from "@tanstack/react-router";

import { GroupsSection } from "@/components/shine/org";
import { PageHeader } from "@/components/shine/ui";

export const Route = createFileRoute("/panel/grupos")({
  head: () => ({
    meta: [
      { title: "Mis grupos · Shine" },
      { name: "description", content: "Grupos de alumnos del centro." },
      { property: "og:title", content: "Mis grupos · Shine" },
      { property: "og:description", content: "Grupos de alumnos del centro." },
    ],
  }),
  component: () => (
    <>
      <PageHeader title="Mis grupos" subtitle="Grupos que tienes asignados en Escola Vallparadís." />
      <GroupsSection readOnly />
    </>
  ),
});
