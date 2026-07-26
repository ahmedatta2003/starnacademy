import { DataTable, PageHeader, Badge, Column } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Switch } from "@/components/ui/switch";

const AdminQuizzes = () => {
  const { data, isLoading } = useAdminTable<any>("quiz_questions", { orderBy: "display_order", ascending: true });
  const { update } = useAdminMutate("quiz_questions");

  const columns: Column<any>[] = [
    {
      key: "question_ar",
      header: "Question",
      render: (r) => <span className="block max-w-[360px] truncate">{r.question_ar || r.question_en}</span>,
    },
    { key: "course", header: "Course", render: (r) => <Badge>{r.course || "any"}</Badge> },
    { key: "dimension", header: "Dimension", render: (r) => r.dimension || "—" },
    { key: "difficulty", header: "Difficulty", render: (r) => r.difficulty ?? "—" },
    {
      key: "age",
      header: "Age range",
      render: (r) => `${r.min_age ?? "—"}–${r.max_age ?? "—"}`,
    },
    {
      key: "is_visible",
      header: "Active",
      render: (r) => <Switch checked={!!r.is_visible} onCheckedChange={(v) => update(r.id, { is_visible: v })} />,
    },
  ];

  return (
    <div>
      <PageHeader title="Quizzes" subtitle="Adaptive placement question bank." />
      <DataTable
        rows={data}
        columns={columns}
        loading={isLoading}
        searchKeys={["question_ar", "question_en", "course", "dimension"]}
      />
    </div>
  );
};

export default AdminQuizzes;
