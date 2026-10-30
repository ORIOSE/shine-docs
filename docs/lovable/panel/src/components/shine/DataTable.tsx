import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sort?: (row: T) => number | string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchText,
  onRowClick,
  selectable,
  selected,
  onSelect,
  mobileCard,
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText?: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selected?: Set<string>;
  onSelect?: (s: Set<string>) => void;
  mobileCard: (row: T) => ReactNode;
  toolbar?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);

  const data = useMemo(() => {
    let r = rows;
    if (q && searchText) r = r.filter((x) => searchText(x).toLowerCase().includes(q.toLowerCase()));
    const col = columns.find((c) => c.key === sortKey);
    if (col?.sort) r = [...r].sort((a, b) => (col.sort!(a) > col.sort!(b) ? dir : col.sort!(a) < col.sort!(b) ? -dir : 0));
    return r;
  }, [rows, q, sortKey, dir, columns, searchText]);

  const toggle = (id: string) => {
    if (!selected || !onSelect) return;
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    onSelect(n);
  };
  const allOn = selected && data.length > 0 && data.every((r) => selected.has(r.id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {searchText && (
          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-muted" aria-hidden />
            <Input aria-label="Buscar" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} className="pl-11" />
          </div>
        )}
        {toolbar}
      </div>

      <div className="hidden overflow-x-auto rounded-lg bg-surface shadow-card md:block">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-line">
              {selectable && (
                <th className="w-12 px-4">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos"
                    className="size-5 accent-[var(--teal)]"
                    checked={!!allOn}
                    onChange={() => onSelect?.(allOn ? new Set() : new Set(data.map((r) => r.id)))}
                  />
                </th>
              )}
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-3 text-left label-text", c.className)}>
                  {c.sort ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-ink"
                      onClick={() => {
                        if (sortKey === c.key) setDir((d) => (d === 1 ? -1 : 1));
                        else {
                          setSortKey(c.key);
                          setDir(1);
                        }
                      }}
                    >
                      {c.header}
                      {sortKey === c.key ? dir === 1 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" /> : <ArrowUpDown className="size-4 opacity-50" />}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr
                key={r.id}
                onClick={() => onRowClick?.(r)}
                className={cn("shine-t h-14 border-b border-line last:border-0 hover:bg-teal-tint", onRowClick && "cursor-pointer")}
              >
                {selectable && (
                  <td className="px-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" aria-label="Seleccionar" className="size-5 accent-[var(--teal)]" checked={selected?.has(r.id)} onChange={() => toggle(r.id)} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-2", c.className)}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="p-6 text-ink-muted">No hay resultados con esa búsqueda.</p>}
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {data.map((r) => (
          <div key={r.id} className="flex items-start gap-3">
            {selectable && (
              <input type="checkbox" aria-label="Seleccionar" className="mt-5 size-5 accent-[var(--teal)]" checked={selected?.has(r.id)} onChange={() => toggle(r.id)} />
            )}
            <div className="flex-1" onClick={() => onRowClick?.(r)}>
              {mobileCard(r)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
