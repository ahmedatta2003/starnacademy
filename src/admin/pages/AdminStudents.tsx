import { DataTable, PageHeader, Badge, fmtDate, Column } from "../components/DataTable";
import { useAdminTable } from "../lib/data";

const AdminStudents = () => {
  const { data, isLoading } = useAdminTable<any>("profiles", { orderBy: "created_at" });
  const rows = (data ?? []).filter((r) => r.role === "child");

  const columns: Column<any>[] = [
    { key: "full_name", header: "Name", render: (r) => r.full_name || "—" },
    { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
    { key: "phone", header: "Phone", render: (r) => r.phone || "—" },
    { key: "role", header: "Role", render: () => <Badge tone="success">student</Badge> },
    { key: "created_at", header: "Joined", render: (r) => fmtDate(r.created_at) },
  ];

  return (
    <div>
      <PageHeader title="Students" subtitle="All child accounts on the platform." />
      <DataTable rows={rows} columns={columns} loading={isLoading} searchKeys={["full_name", "email", "phone"]} />
    </div>
  );
};

export default AdminStudents;
