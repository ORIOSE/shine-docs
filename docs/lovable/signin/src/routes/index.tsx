import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CloudOff, RotateCw, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shine — Login" },
      { name: "description", content: "Inicia sesión en Shine de forma segura. Practicamos juntos." },
      { property: "og:title", content: "Shine — Login" },
      { property: "og:description", content: "Inicia sesión en Shine de forma segura. Practicamos juntos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

type Mode = "normal" | "loading" | "error";
const modes: { id: Mode; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "loading", label: "Cargando" },
  { id: "error", label: "Error" },
];

function Login() {
  const [mode, setMode] = useState<Mode>("normal");
  const loading = mode === "loading";

  const submit = () => {
    setMode("loading");
    setTimeout(() => setMode("normal"), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-shell py-6 font-nunito">
      <div className="flex gap-1.5 rounded-full bg-surface p-1.5 shadow-card">
        {modes.map((m) => (
          <button
            key={m.id}
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className="min-h-10 cursor-pointer rounded-full px-[18px] text-sm font-bold text-ink-muted aria-pressed:bg-teal-tint aria-pressed:text-teal-dark"
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative h-[640px] w-[390px] max-w-full overflow-hidden rounded-[32px] border border-frame-border bg-screen shadow-frame">
        <div className="absolute inset-0 flex flex-col px-6 pb-10 pt-6">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal shadow-logo">
                <Sparkles className="h-12 w-12 text-on-teal" strokeWidth={2.25} />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[44px] font-extrabold tracking-[-0.5px] text-teal">Shine</span>
                <span className="h-3 w-3 rounded-full bg-amber" />
              </div>
              <span className="text-lg font-semibold text-ink-muted">Practicamos juntos</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {mode === "error" && (
              <div role="alert" className="flex gap-3 rounded-xl border-l-4 border-amber bg-amber-tint px-4 py-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface text-amber-dark">
                  <CloudOff className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-ink">No hemos podido conectar</span>
                  <span className="text-base leading-normal text-ink">
                    Vuelve a intentarlo, estamos aquí para ayudarte.
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              aria-busy={loading}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-teal px-6 text-lg font-bold tracking-[0.2px] text-on-teal transition-transform duration-150 hover:bg-teal-dark active:scale-[0.97] disabled:cursor-default"
            >
              {loading ? (
                <span
                  aria-label="Cargando"
                  className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-current border-t-transparent"
                />
              ) : mode === "error" ? (
                <>
                  <RotateCw className="h-5 w-5 -scale-x-100" />
                  <span>Reintentar</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>

            <div className="flex items-start gap-2 px-1">
              <ShieldCheck className="mt-0.5 h-[18px] w-[18px] flex-none text-ink-muted" />
              <span className="text-sm leading-normal text-ink-muted">
                Se abrirá el navegador para iniciar sesión de forma segura. Volverás a la app al terminar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
