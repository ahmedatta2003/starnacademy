import { DataTable, PageHeader, Badge, Column } from "../components/DataTable";
import { useAdminTable } from "../lib/data";

const AdminAudit = () => {
  const { data, isLoading } = useAdminTable<any>("admin_audit_logs");
  const sessions = useAdminTable<any>("admin_sessions");

  const columns: Column<any>[] = [
    { key: "action", header: "Action", render: (r) => <code className="text-xs">{r.action}</code> },
    { key: "entity", header: "Entity", render: (r) => (r.entity ? <Badge>{r.entity}</Badge> : "—") },
    {
      key: "entity_id",
      header: "Record",
      render: (r) => (r.entity_id ? <span className="font-mono text-xs">{String(r.entity_id).slice(0, 8)}</span> : "—"),
    },
    {
      key: "user_agent",
      header: "Client",
      render: (r) => <span className="text-muted-foreground text-xs block max-w-[240px] truncate">{r.user_agent || "—"}</span>,
    },
    {
      key: "created_at",
      header: "When",
      render: (r) => <span className="tabular-nums text-xs">{new Date(r.created_at).toLocaleString()}</span>,
    },
  ];

  const sessionCols: Column<any>[] = [
    { key: "device", header: "Device" },
    {
      key: "user_agent",
      header: "User agent",
      render: (r) => <span className="text-muted-foreground text-xs block max-w-[320px] truncate">{r.user_agent || "—"}</span>,
    },
    {
      key: "created_at",
      header: "Started",
      render: (r) => <span className="tabular-nums text-xs">{new Date(r.created_at).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <PageHeader title="Audit Logs" subtitle="Every administrative write is recorded." />
        <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["action", "entity"]} />
      </div>
      <div>
        <h2 className="text-sm font-medium mb-2">Admin sessions & devices</h2>
        <DataTable rows={sessions.data} columns={sessionCols} loading={sessions.isLoading} pageSize={8} searchKeys={["device", "user_agent"]} />
      </div>
    </div>
  );
};

export default AdminAudit;
