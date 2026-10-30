import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "@/data/mock";

export const ROLE_LABELS: Record<Role, string> = {
  familia: "Familia",
  profesional: "Profesional independiente",
  gabinete: "Coordinador de gabinete",
  centro: "Coordinador de centro",
  docente: "Docente",
};

export const ROLE_USER: Record<Role, string> = {
  familia: "Laura",
  profesional: "Marta",
  gabinete: "Marta",
  centro: "Jordi",
  docente: "Núria",
};

type Font = "nunito" | "dyslexic";
interface Toast {
  id: number;
  text: string;
}
interface Ctx {
  role: Role;
  setRole: (r: Role) => void;
  font: Font;
  setFont: (f: Font) => void;
  toast: (text: string) => void;
}
const ShineCtx = createContext<Ctx | null>(null);

export function ShineProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("profesional");
  const [font, setFont] = useState<Font>("nunito");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-base",
      font === "dyslexic" ? '"OpenDyslexic", "Nunito", sans-serif' : '"Nunito", system-ui, sans-serif',
    );
  }, [font]);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ShineCtx.Provider value={{ role, setRole, font, setFont, toast }}>
      {children}
      <div aria-live="polite" className="no-print fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="rounded-md bg-ink px-5 py-3 text-base font-semibold text-on-teal shadow-raised">
            {t.text}
          </div>
        ))}
      </div>
    </ShineCtx.Provider>
  );
}

export function useShine() {
  const c = useContext(ShineCtx);
  if (!c) throw new Error("useShine fuera de ShineProvider");
  return c;
}

export const can = {
  edit: (r: Role) => r !== "familia",
  invite: (r: Role) => r !== "familia",
  notes: (r: Role) => r !== "familia",
  members: (r: Role) => r === "gabinete" || r === "centro",
  isCoord: (r: Role) => r === "gabinete" || r === "centro",
  portfolio: (r: Role) => r !== "familia",
};
