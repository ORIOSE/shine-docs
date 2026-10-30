export type AreaId = "fon" | "vis" | "mem" | "ort" | "flu";
export type Trend = "sube" | "estable" | "baja";
export type Status = "activo" | "pausa" | "archivado";
export type FamilyLink = "vinculada" | "pendiente" | "no";
export type Role = "familia" | "profesional" | "gabinete" | "centro" | "docente";

export const AREAS: { id: AreaId; name: string; short: string }[] = [
  { id: "fon", name: "Conciencia fonológica", short: "Fonológica" },
  { id: "vis", name: "Discriminación visual", short: "Visual" },
  { id: "mem", name: "Memoria de trabajo", short: "Memoria" },
  { id: "ort", name: "Ortografía", short: "Ortografía" },
  { id: "flu", name: "Fluidez lectora", short: "Fluidez" },
];
export const AREA_COLORS: Record<AreaId, string> = {
  fon: "#3DBFA0",
  vis: "#F5A623",
  mem: "#2A8C74",
  ort: "#6D45A8",
  flu: "#6B7280",
};
export const areaName = (id: AreaId) => AREAS.find((a) => a.id === id)!.name;

export type Levels = Record<AreaId, number>;

export interface Student {
  id: string;
  name: string;
  daysSince: number;
  total: number;
  last4: number;
  levels: Levels;
  trend: Trend;
  status: Status;
  family: FamilyLink;
  owner: string;
  group?: string;
  centerSessions?: number;
  homeSessions?: number;
}

const L = (fon: number, vis: number, mem: number, ort: number, flu: number): Levels => ({ fon, vis, mem, ort, flu });

const owners = ["Marta R.", "Jordi P.", "Elena S.", "Marta R."];
const raw: [string, number, number, number, Levels, Trend, Status, FamilyLink][] = [
  ["Lucía", 0, 34, 7, L(8, 6, 4, 7, 5), "sube", "activo", "vinculada"],
  ["Mateo", 1, 21, 6, L(5, 7, 5, 4, 4), "estable", "activo", "vinculada"],
  ["Noa", 2, 48, 8, L(9, 8, 7, 8, 7), "sube", "activo", "pendiente"],
  ["Hugo", 16, 12, 1, L(3, 4, 3, 2, 3), "baja", "activo", "no"],
  ["Martina", 3, 27, 5, L(6, 6, 6, 5, 6), "estable", "activo", "vinculada"],
  ["Leo", 21, 9, 0, L(4, 3, 2, 3, 2), "baja", "activo", "no"],
  ["Vera", 5, 39, 6, L(7, 9, 6, 6, 8), "sube", "activo", "vinculada"],
  ["Pau", 4, 15, 4, L(5, 5, 4, 5, 3), "sube", "activo", "pendiente"],
  ["Aina", 30, 42, 0, L(8, 7, 7, 7, 6), "estable", "pausa", "vinculada"],
  ["Iker", 7, 18, 3, L(4, 6, 5, 4, 5), "estable", "activo", "vinculada"],
  ["Carla", 10, 30, 2, L(7, 5, 5, 6, 6), "baja", "activo", "no"],
  ["Dani", 1, 25, 7, L(6, 7, 6, 6, 5), "sube", "activo", "vinculada"],
  ["Olivia", 2, 11, 5, L(3, 4, 4, 3, 3), "sube", "activo", "pendiente"],
  ["Sara", 95, 52, 0, L(9, 9, 8, 9, 8), "estable", "archivado", "vinculada"],
];
const groups = ["3.º A", "4.º B", "5.º A"];

export const STUDENTS: Student[] = raw.map(([name, daysSince, total, last4, levels, trend, status, family], i) => ({
  id: name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
  name,
  daysSince,
  total,
  last4,
  levels,
  trend,
  status,
  family,
  owner: owners[i % owners.length]!,
  group: groups[i % 3]!,
  centerSessions: Math.round(total * 0.6),
  homeSessions: total - Math.round(total * 0.6),
}));

export const getStudent = (id: string) => STUDENTS.find((s) => s.id === id);

export function lowestHighest(l: Levels) {
  const entries = Object.entries(l) as [AreaId, number][];
  const sorted = [...entries].sort((a, b) => a[1] - b[1]);
  return { low: sorted[0]!, high: sorted[sorted.length - 1]! };
}

export function lastSessionLabel(days: number) {
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

/* Lucía history */
export const LUCIA_HISTORY: Record<AreaId, number[]> = {
  fon: [5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8],
  vis: [4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  mem: [3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4],
  ort: [4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7],
  flu: [3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5],
};

export function historyFor(s: Student): Record<AreaId, number[]> {
  if (s.id === "lucia") return LUCIA_HISTORY;
  const out = {} as Record<AreaId, number[]>;
  (Object.keys(s.levels) as AreaId[]).forEach((a) => {
    const end = s.levels[a];
    const start = Math.max(1, end - (s.trend === "sube" ? 3 : 1));
    out[a] = Array.from({ length: 12 }, (_, i) => Math.round(start + ((end - start) * i) / 11));
  });
  return out;
}

export const weeklySeries = (h: Record<AreaId, number[]>) =>
  Array.from({ length: 12 }, (_, i) => ({
    semana: `S${i + 1}`,
    fon: h.fon[i] ?? 0,
    vis: h.vis[i] ?? 0,
    mem: h.mem[i] ?? 0,
    ort: h.ort[i] ?? 0,
    flu: h.flu[i] ?? 0,
  }));

export interface Activity {
  name: string;
  area: AreaId;
  time: string;
  hits: string;
  pace: string;
}
export interface Session {
  date: string;
  type: "Regular" | "Evaluación periódica" | "Ajuste" | "Bloque inicial";
  where: "Gabinete" | "Casa" | "Centro";
  activities: number;
  rating: "Muy bien" | "Bien" | "Me ha costado";
  minutes: number;
  detail: Activity[];
}
const acts: Activity[] = [
  { name: "Rimas locas", area: "fon", time: "3 min", hits: "9 de 10", pace: "Buen ritmo" },
  { name: "Busca la letra", area: "vis", time: "4 min", hits: "7 de 10", pace: "Ritmo tranquilo" },
  { name: "Palabras encadenadas", area: "mem", time: "4 min", hits: "5 de 8", pace: "Necesitó más tiempo" },
  { name: "Lectura cronometrada", area: "flu", time: "3 min", hits: "42 palabras", pace: "Buen ritmo" },
  { name: "¿B o V?", area: "ort", time: "4 min", hits: "8 de 10", pace: "Buen ritmo" },
];
const d = (n: number) => acts.slice(0, n);
export const LUCIA_SESSIONS: Session[] = [
  { date: "Hoy, 17:20", type: "Regular", where: "Gabinete", activities: 4, rating: "Bien", minutes: 14, detail: d(4) },
  { date: "Ayer, 18:05", type: "Regular", where: "Casa", activities: 4, rating: "Me ha costado", minutes: 17, detail: d(4) },
  { date: "20 oct", type: "Evaluación periódica", where: "Gabinete", activities: 5, rating: "Bien", minutes: 19, detail: d(5) },
  { date: "17 oct", type: "Regular", where: "Casa", activities: 4, rating: "Muy bien", minutes: 12, detail: d(4) },
  { date: "15 oct", type: "Regular", where: "Gabinete", activities: 4, rating: "Bien", minutes: 15, detail: d(4) },
  { date: "13 oct", type: "Regular", where: "Casa", activities: 3, rating: "Bien", minutes: 11, detail: d(3) },
];

export const DIFFICULT = [
  { name: "Palabras encadenadas", area: "mem" as AreaId, text: "4 de 6 veces «me ha costado»" },
  { name: "Lectura cronometrada", area: "flu" as AreaId, text: "Tiempo 30 % por encima de su media" },
  { name: "Busca la letra", area: "vis" as AreaId, text: "2 de 5 veces «me ha costado»" },
];

export const LEVEL_CHANGES = [
  { date: "20 oct", area: "fon" as AreaId, from: 7, to: 8, reason: "Evaluación periódica" },
  { date: "8 oct", area: "ort" as AreaId, from: 6, to: 7, reason: "Evidencia acumulada" },
  { date: "29 sep", area: "vis" as AreaId, from: 5, to: 6, reason: "Ajuste por facilidad" },
  { date: "15 sep", area: "mem" as AreaId, from: 5, to: 4, reason: "Ajuste por dificultad" },
  { date: "1 sep", area: "fon" as AreaId, from: 0, to: 5, reason: "Inicial" },
];

export interface Note {
  id: string;
  date: string;
  author: string;
  shared: boolean;
  text: string;
}
export const LUCIA_NOTES: Note[] = [
  { id: "n1", date: "20 oct", author: "Marta R.", shared: false, text: "Buen ritmo en fonológica. Proponer a la familia dos sesiones en casa entre semana, cortas." },
  { id: "n2", date: "6 oct", author: "Marta R.", shared: true, text: "Lucía pidió repetir «Palabras encadenadas». Reforzar memoria de trabajo con juegos orales en casa." },
];

/* Family demo */
export interface FamilyChild {
  id: string;
  name: string;
  coverage: string;
  coverageKind: "familia" | "centro" | "prueba" | "sin";
  trialLeft?: number;
  lastSession: string;
  next: string;
}
export const FAMILY = {
  name: "Laura",
  children: [
    { id: "mateo", name: "Mateo", coverage: "Plan Familia", coverageKind: "familia", lastSession: "Ayer · Regular", next: "Tienes una sesión pendiente" },
    { id: "noa", name: "Noa", coverage: "Centro Escola Vallparadís", coverageKind: "centro", lastSession: "Hace 2 días · Regular", next: "Toca sesión de ajuste" },
    { id: "olivia", name: "Olivia", coverage: "Prueba · 2 sesiones restantes", coverageKind: "prueba", trialLeft: 2, lastSession: "Hace 2 días · Bloque inicial", next: "Completa el bloque inicial" },
  ] as FamilyChild[],
  plan: { name: "Plan Familia", origin: "App Store", renews: "14 nov 2026", ends: "—", price: "4,99 € / mes" },
  payments: [
    { date: "14 oct 2026", concept: "Plan Familia mensual", amount: "4,99 €", status: "Pagado" },
    { date: "14 sep 2026", concept: "Plan Familia mensual", amount: "4,99 €", status: "Pagado" },
    { date: "14 ago 2026", concept: "Plan Familia mensual", amount: "4,99 €", status: "Pagado" },
  ],
};

export const GABINETE = {
  name: "Gabinete Aprèn",
  coordinator: "Marta R.",
  seats: 20,
  used: 14,
  plan: "Licencia Gabinete",
  renews: "1 feb 2027",
  amount: "89 € / mes",
  payment: "Al día",
};
export const CENTRO = {
  name: "Escola Vallparadís",
  seats: 60,
  used: 47,
  groups: 3,
  ends: "30 jun 2027",
  payment: "Al día",
};

export interface Member {
  id: string;
  name: string;
  role: string;
  since: string;
  students: number;
  lastActive: string;
}
export const MEMBERS: Member[] = [
  { id: "m1", name: "Marta R.", role: "Coordinadora", since: "3 mar 2025", students: 6, lastActive: "Hoy" },
  { id: "m2", name: "Jordi P.", role: "Profesional", since: "12 abr 2025", students: 4, lastActive: "Ayer" },
  { id: "m3", name: "Elena S.", role: "Profesional", since: "2 sep 2025", students: 4, lastActive: "Hace 3 días" },
  { id: "m4", name: "Pere V.", role: "Profesional", since: "10 oct 2026", students: 0, lastActive: "Hace 9 días" },
];

export const INVITE_CODES = [
  { code: "APREN-PRO-7K2Q", role: "Profesional", uses: "1 de 3", expires: "30 nov 2026" },
  { code: "APREN-COO-4M9X", role: "Coordinador", uses: "0 de 1", expires: "5 nov 2026" },
];

export const GROUPS = [
  { id: "g1", name: "3.º A", teacher: "Núria F.", students: ["Lucía", "Martina", "Leo", "Iker", "Olivia"] },
  { id: "g2", name: "4.º B", teacher: "Albert G.", students: ["Mateo", "Vera", "Aina", "Carla"] },
  { id: "g3", name: "5.º A", teacher: "Sílvia M.", students: ["Noa", "Hugo", "Pau", "Dani", "Sara"] },
];

export const WEEKLY_SESSIONS = [
  { semana: "1 sep", sesiones: 38 },
  { semana: "8 sep", sesiones: 52 },
  { semana: "15 sep", sesiones: 61 },
  { semana: "22 sep", sesiones: 58 },
  { semana: "29 sep", sesiones: 66 },
  { semana: "6 oct", sesiones: 71 },
  { semana: "13 oct", sesiones: 69 },
  { semana: "20 oct", sesiones: 74 },
];

export const ACCESS_LOG = [
  { date: "22 oct 2026, 10:14", who: "Marta R.", action: "Invitó a Pere V. como profesional" },
  { date: "20 oct 2026, 17:40", who: "Marta R.", action: "Reasignó a Hugo a Elena S." },
  { date: "15 oct 2026, 09:02", who: "Jordi P.", action: "Exportó el informe de Vera" },
  { date: "1 oct 2026, 12:30", who: "Marta R.", action: "Liberó a Sara de la licencia" },
];

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "trial" | "info" | "success";
}
export const NOTICES: Notice[] = [
  { id: "a1", title: "A Olivia le quedan 2 sesiones de prueba", body: "Puedes contratar un plan desde la app cuando quieras.", date: "Hoy", read: false, kind: "trial" },
  { id: "a2", title: "Resumen semanal listo", body: "Mateo ha hecho 3 sesiones esta semana. ¡Buen trabajo!", date: "Ayer", read: false, kind: "success" },
  { id: "a3", title: "Hugo lleva 16 días sin practicar", body: "Quizá sea buen momento para animarle.", date: "21 oct", read: false, kind: "info" },
  { id: "a4", title: "Novedades en Shine", body: "Hemos añadido nuevas actividades de fluidez lectora.", date: "15 oct", read: true, kind: "info" },
];
