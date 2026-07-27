import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Column, DataTable, fmtDate, PageHeader } from "../components/DataTable";
import { useAdminTable } from "../lib/data";
import { logAdminAction } from "../lib/audit";

export const AdminMediaLibrary = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.storage
      .from("uploads")
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!active) return;
        setFiles(data ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const columns: Column<any>[] = [
    { key: "name", header: "File", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "metadata", header: "Size", render: (r) => (r.metadata?.size ? `${Math.round(r.metadata.size / 1024)} KB` : "—") },
    { key: "created_at", header: "Uploaded", render: (r) => fmtDate(r.created_at) },
    { key: "updated_at", header: "Updated", render: (r) => fmtDate(r.updated_at) },
  ];

  return (
    <div>
      <PageHeader title="Media Library" subtitle="Uploaded files from the public uploads bucket." />
      <DataTable rows={files} columns={columns} loading={loading} searchKeys={["name"]} />
    </div>
  );
};

export const AdminTestimonials = () => {
  const { data, isLoading } = useAdminTable<any>("parent_testimonials", { orderBy: "display_order", ascending: true });
  const columns: Column<any>[] = [
    { key: "parent_name", header: "Parent" },
    { key: "child_name", header: "Child" },
    { key: "testimonial_ar", header: "Testimonial", render: (r) => <span className="block max-w-[420px] truncate">{r.testimonial_ar}</span> },
    { key: "rating", header: "Rating", render: (r) => `${r.rating ?? "—"}/5` },
    { key: "is_visible", header: "Visible", render: (r) => <Badge tone={r.is_visible ? "success" : "muted"}>{r.is_visible ? "yes" : "no"}</Badge> },
  ];
  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Parent testimonials shown on the website." />
      <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["parent_name", "child_name", "testimonial_ar"]} />
    </div>
  );
};

export const AdminWebsiteContent = () => <Navigate to="/admin/website" replace />;
export const AdminAIModules = () => <Navigate to="/admin/ai" replace />;

export const AdminBlog = () => {
  const { data, isLoading } = useAdminTable<any>("community_posts", { orderBy: "created_at" });
  const columns: Column<any>[] = [
    { key: "content", header: "Content", render: (r) => <span className="block max-w-[520px] truncate">{r.content}</span> },
    { key: "image_url", header: "Media", render: (r) => (r.image_url ? <Badge tone="success">image</Badge> : "—") },
    { key: "created_at", header: "Published", render: (r) => fmtDate(r.created_at) },
  ];
  return (
    <div>
      <PageHeader title="Blog" subtitle="Published community content available for editorial review." />
      <DataTable rows={data} columns={columns} loading={isLoading} searchKeys={["content"]} />
    </div>
  );
};

export const AdminReports = () => {
  const parentReports = useAdminTable<any>("parent_reports", { orderBy: "created_at" });
  const contentReports = useAdminTable<any>("content_reports", { orderBy: "created_at" });
  const rows = [
    ...(parentReports.data ?? []).map((r) => ({ ...r, report_type: "parent", title: r.report_title ?? r.summary ?? "Parent report" })),
    ...(contentReports.data ?? []).map((r) => ({ ...r, report_type: "content", title: r.reason ?? "Content report" })),
  ];
  const columns: Column<any>[] = [
    { key: "report_type", header: "Type", render: (r) => <Badge>{r.report_type}</Badge> },
    { key: "title", header: "Title", render: (r) => <span className="block max-w-[420px] truncate">{r.title}</span> },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "pending" ? "warn" : "muted"}>{r.status ?? "ready"}</Badge> },
    { key: "created_at", header: "Created", render: (r) => fmtDate(r.created_at) },
  ];
  return (
    <div>
      <PageHeader title="Reports" subtitle="Parent learning reports and content moderation reports." />
      <DataTable rows={rows} columns={columns} loading={parentReports.isLoading || contentReports.isLoading} searchKeys={["title", "status", "report_type"]} />
    </div>
  );
};

export const AdminUserManagement = () => {
  const profiles = useAdminTable<any>("profiles", { orderBy: "created_at" });
  const roles = useAdminTable<any>("user_roles", { orderBy: "role", ascending: true });
  const roleByUser = new Map((roles.data ?? []).map((r) => [r.user_id, r.role]));
  const rows = (profiles.data ?? []).map((p) => ({ ...p, account_role: roleByUser.get(p.id) ?? p.role }));
  const columns: Column<any>[] = [
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
    { key: "account_role", header: "Role", render: (r) => <Badge tone={r.account_role === "admin" ? "success" : "muted"}>{r.account_role}</Badge> },
    { key: "created_at", header: "Joined", render: (r) => fmtDate(r.created_at) },
  ];
  return (
    <div>
      <PageHeader title="User Management" subtitle="Accounts and assigned roles." />
      <DataTable rows={rows} columns={columns} loading={profiles.isLoading || roles.isLoading} searchKeys={["full_name", "email", "account_role"]} />
    </div>
  );
};

export const AdminNotifications = () => {
  const bookings = useAdminTable<any>("course_bookings", { orderBy: "created_at", limit: 50 });
  const reports = useAdminTable<any>("content_reports", { orderBy: "created_at", limit: 50 });
  const rows = [
    ...(bookings.data ?? []).map((r) => ({ id: `booking-${r.id}`, type: "booking", message: `${r.child_name ?? "Student"} requested ${r.course ?? "a course"}`, status: r.status ?? "new", created_at: r.created_at })),
    ...(reports.data ?? []).map((r) => ({ id: `report-${r.id}`, type: "report", message: r.reason ?? "Content report", status: r.status ?? "pending", created_at: r.created_at })),
  ];
  const columns: Column<any>[] = [
    { key: "type", header: "Type", render: (r) => <Badge>{r.type}</Badge> },
    { key: "message", header: "Message" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "pending" || r.status === "new" ? "warn" : "muted"}>{r.status}</Badge> },
    { key: "created_at", header: "When", render: (r) => fmtDate(r.created_at) },
  ];
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Operational alerts from bookings and moderation." />
      <DataTable rows={rows} columns={columns} loading={bookings.isLoading || reports.isLoading} searchKeys={["type", "message", "status"]} />
    </div>
  );
};

export const AdminProfile = () => {
  const { user, profile } = useAuth();
  return (
    <div>
      <PageHeader title="Profile" subtitle="Current administrator account." />
      <Card className="p-5 max-w-2xl divide-y divide-border">
        <div className="flex items-center justify-between py-2 text-sm"><span className="text-muted-foreground">Email</span><span>{user?.email ?? "—"}</span></div>
        <div className="flex items-center justify-between py-2 text-sm"><span className="text-muted-foreground">Name</span><span>{profile?.full_name ?? "—"}</span></div>
        <div className="flex items-center justify-between py-2 text-sm"><span className="text-muted-foreground">Role</span><Badge tone="success">administrator</Badge></div>
      </Card>
    </div>
  );
};

export const AdminLogout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await logAdminAction("admin.logout");
      await supabase.auth.signOut();
      navigate("/admin/login", { replace: true });
    })();
  }, [navigate]);
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
      Signing out…
    </div>
  );
};