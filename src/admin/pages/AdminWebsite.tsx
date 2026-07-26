import { useState } from "react";
import { DataTable, PageHeader, Badge, Column } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const EditableCell = ({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string) => void;
}) => {
  const [v, setV] = useState(value ?? "");
  return (
    <Input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => v !== (value ?? "") && onSave(v)}
      className="h-8 text-sm min-w-[200px]"
    />
  );
};

const AdminWebsite = () => {
  const [tab, setTab] = useState<"sections" | "content" | "testimonials" | "partners">("sections");

  const sections = useAdminTable<any>("site_sections", { orderBy: "display_order", ascending: true });
  const content = useAdminTable<any>("site_content", { orderBy: "section", ascending: true });
  const testimonials = useAdminTable<any>("parent_testimonials", { orderBy: "display_order", ascending: true });
  const partners = useAdminTable<any>("partners", { orderBy: "display_order", ascending: true });

  const mSections = useAdminMutate("site_sections");
  const mContent = useAdminMutate("site_content");
  const mTestimonials = useAdminMutate("parent_testimonials");
  const mPartners = useAdminMutate("partners");

  const sectionCols: Column<any>[] = [
    { key: "section_key", header: "Key", render: (r) => <code className="text-xs">{r.section_key}</code> },
    { key: "label_ar", header: "Label (AR)" },
    { key: "label_en", header: "Label (EN)", render: (r) => <span className="text-muted-foreground">{r.label_en}</span> },
    { key: "display_order", header: "Order" },
    {
      key: "is_visible",
      header: "Visible",
      render: (r) => <Switch checked={!!r.is_visible} onCheckedChange={(v) => mSections.update(r.id, { is_visible: v })} />,
    },
  ];

  const contentCols: Column<any>[] = [
    { key: "section", header: "Section", render: (r) => <Badge>{r.section}</Badge> },
    { key: "content_key", header: "Key", render: (r) => <code className="text-xs">{r.content_key}</code> },
    {
      key: "value_ar",
      header: "Value (AR)",
      render: (r) => <EditableCell value={r.value_ar} onSave={(v) => mContent.update(r.id, { value_ar: v })} />,
    },
    {
      key: "value_en",
      header: "Value (EN)",
      render: (r) => <EditableCell value={r.value_en} onSave={(v) => mContent.update(r.id, { value_en: v })} />,
    },
  ];

  const testimonialCols: Column<any>[] = [
    { key: "parent_name", header: "Parent" },
    { key: "child_name", header: "Child" },
    { key: "testimonial_ar", header: "Testimonial", render: (r) => <span className="block max-w-[320px] truncate">{r.testimonial_ar}</span> },
    { key: "rating", header: "Rating", render: (r) => `${r.rating ?? "—"}/5` },
    {
      key: "is_visible",
      header: "Visible",
      render: (r) => <Switch checked={!!r.is_visible} onCheckedChange={(v) => mTestimonials.update(r.id, { is_visible: v })} />,
    },
  ];

  const partnerCols: Column<any>[] = [
    {
      key: "logo_url",
      header: "Logo",
      render: (r) =>
        r.logo_url ? <img src={r.logo_url} alt={r.name} loading="lazy" className="h-7 w-auto object-contain" /> : "—",
    },
    { key: "name", header: "Name" },
    { key: "website_url", header: "Website", render: (r) => <span className="text-muted-foreground truncate block max-w-[220px]">{r.website_url || "—"}</span> },
    {
      key: "is_active",
      header: "Active",
      render: (r) => <Switch checked={!!r.is_active} onCheckedChange={(v) => mPartners.update(r.id, { is_active: v })} />,
    },
  ];

  const tabs = ["sections", "content", "testimonials", "partners"] as const;

  return (
    <div>
      <PageHeader title="Website CMS" subtitle="Control public site sections, copy, testimonials and partners.">
        <div className="flex gap-1 p-0.5 rounded-md bg-muted">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs rounded capitalize ${tab === t ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </PageHeader>

      {tab === "sections" && <DataTable rows={sections.data} columns={sectionCols} loading={sections.isLoading} searchKeys={["section_key", "label_ar", "label_en"]} />}
      {tab === "content" && <DataTable rows={content.data} columns={contentCols} loading={content.isLoading} searchKeys={["section", "content_key", "value_ar", "value_en"]} />}
      {tab === "testimonials" && <DataTable rows={testimonials.data} columns={testimonialCols} loading={testimonials.isLoading} searchKeys={["parent_name", "child_name", "testimonial_ar"]} />}
      {tab === "partners" && <DataTable rows={partners.data} columns={partnerCols} loading={partners.isLoading} searchKeys={["name"]} />}
    </div>
  );
};

export default AdminWebsite;
