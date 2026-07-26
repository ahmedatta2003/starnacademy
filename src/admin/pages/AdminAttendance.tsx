import { DataTable, PageHeader, Badge, fmtDate, Column } from "../components/DataTable";
import { useAdminTable } from "../lib/data";

const tone = (s?: string) => (s === "present" ? "success" : s === "late" ? "warn" : s === "absent" ? "danger" : "muted");

const AdminAttendance = () => {
  const { data, isLoading } = useAdminTable<any>("attendance", { orderBy: "session_date" });

  const columns: Column<any>[] = [
    { key: "session_date", header: "Date", render: (r) => fmtDate(r.session_date) },
    { key: "student_id", header: "Student", render: (r) => <span className="font-mono text-xs">{String(r.student_id).slice(0, 8)}</span> },
    { key: "course_id", header: "Course", render: (r) => (r.course_id ? <span className="font-mono text-xs">{String(r.course_id).slice(0, 8)}</span> : "—") },
    { key: "status", header: "Status", render: (r) => <Badge tone={tone(r.status) as any}>{r.status}</Badge> },
    { key: "notes", header: "Notes", render: (r) => <span className="text-muted-foreground">{r.notes || "—"}</span> },
  ];

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Session attendance records." />
      <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["status", "notes"]} />
    </div>
  );
};

export default AdminAttendance;
