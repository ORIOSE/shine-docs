import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button, Card, Field, Input, MotivationCard, Wordmark } from "@/components/shine/ui";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar · Shine" },
      { name: "description", content: "Accede al panel web de Shine." },
      { property: "og:title", content: "Entrar · Shine" },
      { property: "og:description", content: "Accede al panel web de Shine." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "recover" | "sent">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("laura@ejemplo.com");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <Wordmark />
        {mode === "login" && (
          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => nav({ to: "/panel" }), 500);
            }}
          >
            <div>
              <h1>Hola de nuevo</h1>
              <p className="text-ink-muted">Entra para ver el progreso y gestionar tu cuenta.</p>
            </div>
            <Field label="Email">{(id) => <Input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}</Field>
            <Field label="Contraseña">{(id) => <Input id={id} type="password" defaultValue="demo1234" required />}</Field>
            <Button type="submit" loading={loading}>Entrar</Button>
            <button type="button" onClick={() => setMode("recover")} className="min-h-12 text-left font-semibold text-teal-dark underline-offset-4 hover:underline">
              ¿Has olvidado tu contraseña?
            </button>
          </form>
        )}
        {mode === "recover" && (
          <form className="mt-6 flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setMode("sent"); }}>
            <div>
              <h1>Recupera tu contraseña</h1>
              <p className="text-ink-muted">Te enviaremos un enlace para crear una nueva.</p>
            </div>
            <Field label="Email">{(id) => <Input id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}</Field>
            <Button type="submit">Enviar enlace</Button>
            <button type="button" onClick={() => setMode("login")} className="min-h-12 text-left font-semibold text-teal-dark hover:underline">Volver a entrar</button>
          </form>
        )}
        {mode === "sent" && (
          <div className="mt-6 flex flex-col gap-5">
            <MotivationCard title="Revisa tu correo" icon={MailCheck}>
              Si {email} tiene cuenta, recibirás un enlace en unos minutos.
            </MotivationCard>
            <Button variant="secondary" onClick={() => setMode("login")}>Volver a entrar</Button>
          </div>
        )}
      </Card>
    </main>
  );
}
