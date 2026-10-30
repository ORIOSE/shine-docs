import { createFileRoute } from "@tanstack/react-router";
import { FamilyHome, OrgHome, ProHome, TeacherHome } from "@/components/shine/homes";
import { useShine } from "@/lib/shine-context";

export const Route = createFileRoute("/panel/")({
  head: () => ({
    meta: [
      { title: "Inicio · Shine" },
      { name: "description", content: "Resumen de actividad y siguientes pasos en Shine." },
      { property: "og:title", content: "Inicio · Shine" },
      { property: "og:description", content: "Resumen de actividad y siguientes pasos en Shine." },
    ],
  }),
  component: Home,
});

function Home() {
  const { role } = useShine();
  if (role === "familia") return <FamilyHome />;
  if (role === "profesional") return <ProHome />;
  if (role === "docente") return <TeacherHome />;
  return <OrgHome />;
}
