import { ReactNode, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type Props<T> = {
  rows: T[] | undefined;
  columns: Column<T>[];
  loading?: boolean;
  searchKeys?: string[];
  pageSize?: number;
  empty?: string;
  actions?: ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  rows,
  columns,
  loading,
  searchKeys = [],
  pageSize = 15,
  empty = "No records.",
  actions,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const list = rows ?? [];
    if (!q.trim() || searchKeys.length === 0) return list;
    const needle = q.toLowerCase();
    return list.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle))
    );
  }, [rows, q, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount - 1);
  const slice = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        {searchKeys.length > 0 && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search…"
              className="pl-8 h-8 text-sm"
            />
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {actions}
          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length} rows
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`text-left font-medium px-3 py-2 text-xs uppercase tracking-wider whitespace-nowrap ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            )}
            {!loading && slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-muted-foreground">
                  {empty}
                </td>
              </tr>
            )}
            {!loading &&
              slice.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-muted/30">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-3 py-2 align-middle ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : (row[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 p-2 border-t border-border">
          <span className="text-xs text-muted-foreground tabular-nums">
            {current + 1} / {pageCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={current >= pageCount - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}

export const PageHeader = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) => (
  <div className="flex items-end justify-between gap-4 mb-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export const Badge = ({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "success" | "warn" | "danger" }) => {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-500",
    warn: "bg-amber-500/10 text-amber-500",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
