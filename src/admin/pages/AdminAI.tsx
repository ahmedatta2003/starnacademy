import { DataTable, PageHeader, Badge, fmtDate, Column } from "../components/DataTable";
import { useAdminTable } from "../lib/data";
import { Card } from "@/components/ui/card";

const AdminAI = () => {
  const { data, isLoading } = useAdminTable<any>("ai_events");
  const rows = data ?? [];

  const byModule = rows.reduce<Record<string, number>>((acc, r) => {
    const k = r.module || "unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const overrides = rows.filter((r) => r.overridden).length;

  const columns: Column<any>[] = [
    { key: "module", header: "Module", render: (r) => <Badge>{r.module || "—"}</Badge> },
    { key: "action", header: "Action" },
    { key: "model", header: "Model", render: (r) => <span className="text-muted-foreground text-xs">{r.model || "—"}</span> },
    {
      key: "overridden",
      header: "Override",
      render: (r) => (r.overridden ? <Badge tone="warn">overridden</Badge> : "—"),
    },
    { key: "created_at", header: "When", render: (r) => fmtDate(r.created_at) },
  ];

  return (
    <div>
      <PageHeader title="AI Engine" subtitle="Gateway activity across placement, insights and reports." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total events</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{rows.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Human overrides</div>
          <div className="text-2xl font-semibold mt-1 tabular-nums">{overrides}</div>
        </Card>
        {Object.entries(byModule)
          .slice(0, 2)
          .map(([k, v]) => (
            <Card key={k} className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground truncate">{k}</div>
              <div className="text-2xl font-semibold mt-1 tabular-nums">{v}</div>
            </Card>
          ))}
      </div>
      <DataTable rows={rows} columns={columns} loading={isLoading} searchKeys={["module", "action", "model"]} />
    </div>
  );
};

export default AdminAI;
