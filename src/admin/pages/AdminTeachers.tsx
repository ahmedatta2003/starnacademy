import { DataTable, PageHeader, fmtDate, Column } from "../components/DataTable";
import { useAdminTable } from "../lib/data";

const AdminTeachers = () => {
  const { data, isLoading } = useAdminTable<any>("trainers", { orderBy: "created_at" });

  const columns: Column<any>[] = [
    { key: "specialization", header: "Specialization", render: (r) => r.specialization || "—" },
    { key: "education", header: "Education", render: (r) => r.education || "—" },
    {
      key: "years_of_experience",
      header: "Experience",
      render: (r) => (r.years_of_experience != null ? `${r.years_of_experience} yrs` : "—"),
    },
    {
      key: "certifications",
      header: "Certifications",
      render: (r) => (Array.isArray(r.certifications) ? r.certifications.length : 0),
    },
    { key: "created_at", header: "Added", render: (r) => fmtDate(r.created_at) },
  ];

  return (
    <div>
      <PageHeader title="Teachers" subtitle="Trainer profiles and expertise." />
      <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["specialization", "education"]} />
    </div>
  );
};

export default AdminTeachers;
