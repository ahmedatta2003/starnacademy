import { useState } from "react";
import { DataTable, PageHeader, Badge, fmtDate, Column } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Button } from "@/components/ui/button";

const statusTone = (s?: string) =>
  s === "confirmed" ? "success" : s === "cancelled" ? "danger" : "warn";

const AdminBookings = () => {
  const [tab, setTab] = useState<"course" | "free">("course");
  const course = useAdminTable<any>("course_bookings");
  const free = useAdminTable<any>("free_session_bookings");
  const mCourse = useAdminMutate("course_bookings");
  const mFree = useAdminMutate("free_session_bookings");

  const actions = (table: "course" | "free") => (r: any) => {
    const m = table === "course" ? mCourse : mFree;
    return (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => m.update(r.id, { status: "confirmed" })}>
          Confirm
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => m.update(r.id, { status: "cancelled" })}>
          Cancel
        </Button>
      </div>
    );
  };

  const courseCols: Column<any>[] = [
    { key: "child_name", header: "Child" },
    { key: "child_age", header: "Age" },
    { key: "parent_name", header: "Parent" },
    { key: "phone", header: "Phone" },
    { key: "course", header: "Course" },
    { key: "preferred_time", header: "Preferred" },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status) as any}>{r.status || "new"}</Badge> },
    { key: "created_at", header: "Created", render: (r) => fmtDate(r.created_at) },
    { key: "actions", header: "", render: actions("course") },
  ];

  const freeCols: Column<any>[] = [
    { key: "child_name", header: "Child" },
    { key: "child_age", header: "Age" },
    { key: "parent_email", header: "Parent email" },
    { key: "parent_phone", header: "Phone" },
    { key: "session_date", header: "Session", render: (r) => fmtDate(r.session_date) },
    { key: "status", header: "Status", render: (r) => <Badge tone={statusTone(r.status) as any}>{r.status || "new"}</Badge> },
    { key: "created_at", header: "Created", render: (r) => fmtDate(r.created_at) },
    { key: "actions", header: "", render: actions("free") },
  ];

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Paid course bookings and free trial sessions.">
        <div className="flex gap-1 p-0.5 rounded-md bg-muted">
          {(["course", "free"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs rounded ${tab === t ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {t === "course" ? "Courses" : "Free sessions"}
            </button>
          ))}
        </div>
      </PageHeader>

      {tab === "course" ? (
        <DataTable
          rows={course.data}
          columns={courseCols}
          loading={course.isLoading}
          searchKeys={["child_name", "parent_name", "phone", "email", "course"]}
        />
      ) : (
        <DataTable
          rows={free.data}
          columns={freeCols}
          loading={free.isLoading}
          searchKeys={["child_name", "parent_email", "parent_phone"]}
        />
      )}
    </div>
  );
};

export default AdminBookings;
