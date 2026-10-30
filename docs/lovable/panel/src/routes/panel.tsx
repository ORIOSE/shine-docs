import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, BookUser, Building2, ChevronDown, CreditCard, FileText, HelpCircle, Home, LogOut, Smartphone, User, Users, UsersRound, type LucideIcon } from "lucide-react";
import { Wordmark } from "@/components/shine/ui";
import { ROLE_LABELS, ROLE_USER, useShine } from "@/lib/shine-context";
import { NOTICES, type Role } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel · Shine" },
      { name: "description", content: "Gestiona alumnos, licencias y progreso en Shine." },
      { property: "og:title", content: "Panel · Shine" },
      { property: "og:description", content: "Gestiona alumnos, licencias y progreso en Shine." },
    ],
  }),
  component: PanelLayout,
});

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export function navFor(role: Role): NavItem[] {
  const home = { to: "/panel", label: "Inicio", icon: Home, exact: true };
  const help = { to: "/panel/ayuda", label: "Ayuda", icon: HelpCircle };
  switch (role) {
    case "familia":
      return [home, { to: "/panel/alumnos", label: "Alumnos", icon: Users }, { to: "/panel/plan", label: "Plan", icon: CreditCard }, help];
    case "profesional":
      return [home, { to: "/panel/alumnos", label: "Alumnos", icon: Users }, { to: "/panel/informes", label: "Informes", icon: FileText }, { to: "/panel/plan", label: "Licencia", icon: CreditCard }, help];
    case "gabinete":
    case "centro":
      return [
        home,
        { to: "/panel/organizacion", label: role === "centro" ? "Mi centro" : "Mi gabinete", icon: Building2 },
        { to: "/panel/alumnos", label: "Alumnos", icon: Users },
        { to: "/panel/informes", label: "Informes", icon: FileText },
        help,
      ];
    case "docente":
      return [{ to: "/panel", label: "Mis alumnos", icon: Users, exact: true }, { to: "/panel/grupos", label: "Mis grupos", icon: UsersRound }, help];
  }
}

function PanelLayout() {
  const { role, setRole } = useShine();
  const loc = useLocation();
  const [menu, setMenu] = useState(false);
  const items = navFor(role);
  const unread = NOTICES.filter((n) => !n.read).length;
  const isActive = (i: NavItem) => (i.exact ? loc.pathname === i.to || loc.pathname === i.to + "/" : loc.pathname.startsWith(i.to));

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4">
          <Link to="/panel" aria-label="Shine, inicio"><Wordmark /></Link>
          <nav className="ml-4 hidden flex-1 gap-1 md:flex" aria-label="Secciones">
            {items.map((i) => (
              <Link key={i.to} to={i.to} className={cn("shine-t flex h-12 items-center gap-2 rounded-md px-3 text-base font-semibold hover:bg-teal-tint", isActive(i) ? "bg-teal-tint text-teal-dark" : "text-ink-muted")}>
                <i.icon className="size-[18px]" strokeWidth={isActive(i) ? 2.25 : 2} aria-hidden />
                {i.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <label className="hidden items-center gap-2 lg:flex">
              <span className="label-text">Ver como</span>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-10 rounded-md border border-line bg-surface px-3 text-sm font-semibold focus:border-teal">
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </label>
            <Link to="/panel/avisos" className="press relative flex h-12 items-center gap-1.5 rounded-md px-3 hover:bg-teal-tint" aria-label={`Avisos, ${unread} sin leer`}>
              <Bell className="size-5" aria-hidden />
              <span className="hidden text-sm font-semibold sm:inline">Avisos</span>
              {unread > 0 && <span className="rounded-full bg-amber px-2 text-sm font-bold text-ink">{unread}</span>}
            </Link>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="press flex h-12 items-center gap-2 rounded-md px-3 hover:bg-teal-tint">
                <User className="size-5" aria-hidden />
                <span className="hidden text-sm font-semibold sm:inline">{ROLE_USER[role]}</span>
                <ChevronDown className="size-4" aria-hidden />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-surface p-2 shadow-raised" onClick={() => setMenu(false)}>
                  <Link to="/panel/cuenta" className="flex min-h-12 items-center gap-2 rounded-md px-3 hover:bg-teal-tint"><BookUser className="size-5" />Mi cuenta</Link>
                  {role !== "docente" && role !== "centro" && role !== "gabinete" && (
                    <Link to="/panel/plan" className="flex min-h-12 items-center gap-2 rounded-md px-3 hover:bg-teal-tint"><CreditCard className="size-5" />Plan y pagos</Link>
                  )}
                  <Link to="/alumno" className="flex min-h-12 items-center gap-2 rounded-md px-3 hover:bg-teal-tint"><Smartphone className="size-5" />Vista del alumno (app)</Link>
                  <Link to="/login" className="flex min-h-12 items-center gap-2 rounded-md px-3 text-error hover:bg-shell"><LogOut className="size-5" />Cerrar sesión</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-line px-4 py-2 lg:hidden">
          <span className="label-text">Ver como</span>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="h-10 flex-1 rounded-md border border-line bg-surface px-3 text-sm font-semibold">
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Secciones">
          {items.map((i) => (
            <Link key={i.to} to={i.to} className={cn("flex h-12 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold", isActive(i) ? "border-teal bg-teal-tint text-teal-dark" : "border-line bg-surface")}>
              <i.icon className="size-[18px]" aria-hidden />
              {i.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
