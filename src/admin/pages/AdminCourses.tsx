import { DataTable, PageHeader, Badge, Column } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Switch } from "@/components/ui/switch";

const AdminCourses = () => {
  const { data, isLoading } = useAdminTable<any>("dynamic_courses", { orderBy: "display_order", ascending: true });
  const { update } = useAdminMutate("dynamic_courses");

  const columns: Column<any>[] = [
    { key: "title_ar", header: "Title (AR)", render: (r) => <span className="font-medium">{r.title_ar}</span> },
    { key: "title_en", header: "Title (EN)", render: (r) => <span className="text-muted-foreground">{r.title_en}</span> },
    { key: "level", header: "Level", render: (r) => <Badge>{r.level || "—"}</Badge> },
    { key: "duration", header: "Duration", render: (r) => r.duration || "—" },
    { key: "age_range", header: "Age", render: (r) => r.age_range || "—" },
    { key: "price", header: "Price", render: (r) => (r.price != null ? r.price : "—") },
    {
      key: "is_visible",
      header: "Visible",
      render: (r) => (
        <Switch checked={!!r.is_visible} onCheckedChange={(v) => update(r.id, { is_visible: v })} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Courses" subtitle="Curriculum offered on the public site." />
      <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["title_ar", "title_en", "level"]} />
    </div>
  );
};

export default AdminCourses;
