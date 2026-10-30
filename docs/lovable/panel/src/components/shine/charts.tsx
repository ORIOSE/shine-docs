import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AREAS, AREA_COLORS, type AreaId } from "@/data/mock";
import { AREA_ICON } from "./ui";

const GRID = "#E5E7EB";
const TICK = { fill: "#6B7280", fontSize: 14 };

function AreaLegend() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
      {AREAS.map((a) => {
        const Icon = AREA_ICON[a.id];
        return (
          <li key={a.id} className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-1 w-5 rounded-full" style={{ background: AREA_COLORS[a.id] }} aria-hidden />
            <Icon className="size-4" aria-hidden style={{ color: AREA_COLORS[a.id] }} />
            {a.name}
          </li>
        );
      })}
    </ul>
  );
}

export function AreaLineChart({ data, height = 280 }: { data: Record<string, number | string>[]; height?: number }) {
  return (
    <div>
      <div style={{ height }} role="img" aria-label="Evolución de niveles por área en 12 semanas">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="semana" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E3E0DB", fontFamily: "inherit" }} />
            {AREAS.map((a) => (
              <Line key={a.id} name={a.name} dataKey={a.id} stroke={AREA_COLORS[a.id as AreaId]} strokeWidth={2.5} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <AreaLegend />
    </div>
  );
}

export function SessionsBarChart({ data }: { data: { semana: string; sesiones: number }[] }) {
  return (
    <div style={{ height: 240 }} role="img" aria-label="Sesiones por semana">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="semana" tick={TICK} axisLine={false} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "#E8F6F1" }} contentStyle={{ borderRadius: 12, border: "1px solid #E3E0DB" }} />
          <Bar dataKey="sesiones" name="Sesiones" fill="#3DBFA0" radius={[8, 8, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LevelDistributionChart({ data }: { data: { area: string; Inicial: number; Intermedio: number; Avanzado: number }[] }) {
  return (
    <div style={{ height: 300 }} role="img" aria-label="Distribución de niveles por área">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 40, bottom: 0 }}>
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="area" tick={TICK} axisLine={false} tickLine={false} width={110} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E3E0DB" }} />
          <Legend wrapperStyle={{ fontSize: 14, fontWeight: 600 }} />
          <Bar dataKey="Inicial" stackId="a" fill="#4CAF7D" isAnimationActive={false} label={{ position: "center", fill: "#fff", fontSize: 14, fontWeight: 700 }} />
          <Bar dataKey="Intermedio" stackId="a" fill="#F5A623" isAnimationActive={false} label={{ position: "center", fill: "#1E1E2E", fontSize: 14, fontWeight: 700 }} />
          <Bar dataKey="Avanzado" stackId="a" fill="#6D45A8" isAnimationActive={false} label={{ position: "center", fill: "#fff", fontSize: 14, fontWeight: 700 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
