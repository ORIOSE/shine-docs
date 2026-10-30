import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shine · Panel web" },
      { name: "description", content: "Gestiona alumnos, licencias y progreso de Shine." },
      { property: "og:title", content: "Shine · Panel web" },
      { property: "og:description", content: "Gestiona alumnos, licencias y progreso de Shine." },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
