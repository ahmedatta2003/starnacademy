import { PageHeader } from "../components/DataTable";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useAdminTheme } from "../lib/theme";
import { Switch } from "@/components/ui/switch";
import { useAdminTable } from "../lib/data";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const AdminSettings = () => {
  const { user } = useAuth();
  const { theme, toggle } = useAdminTheme();
  const sections = useAdminTable<any>("site_sections", { orderBy: "display_order", ascending: true });
  const courses = useAdminTable<any>("dynamic_courses", { orderBy: "display_order", ascending: true });

  const visibleSections = (sections.data ?? []).filter((s) => s.is_visible).length;
  const visibleCourses = (courses.data ?? []).filter((c) => c.is_visible).length;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Account, appearance and platform configuration." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-medium mb-2">Account</h2>
          <div className="divide-y divide-border">
            <Row label="Email" value={user?.email ?? "—"} />
            <Row label="Role" value="Administrator" />
            <Row
              label="User ID"
              value={<span className="font-mono text-xs">{user?.id ? user.id.slice(0, 12) + "…" : "—"}</span>}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium mb-2">Appearance</h2>
          <div className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <div className="text-muted-foreground">Dark mode</div>
              <div className="text-xs text-muted-foreground/70">Applies to the admin console only.</div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium mb-2">Public site</h2>
          <div className="divide-y divide-border">
            <Row label="Visible sections" value={`${visibleSections} / ${(sections.data ?? []).length}`} />
            <Row label="Visible courses" value={`${visibleCourses} / ${(courses.data ?? []).length}`} />
            <Row label="Manage" value={<a className="text-primary hover:underline" href="/admin/website">Website CMS</a>} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-medium mb-2">Platform</h2>
          <div className="divide-y divide-border">
            <Row label="Console version" value="v2.0" />
            <Row label="Audit logging" value={<span className="text-emerald-500">Enabled</span>} />
            <Row label="Session tracking" value={<span className="text-emerald-500">Enabled</span>} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
