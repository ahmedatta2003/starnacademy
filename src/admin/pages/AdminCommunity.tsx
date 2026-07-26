import { useState } from "react";
import { DataTable, PageHeader, Badge, fmtDate, Column } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "../lib/audit";
import { toast } from "@/hooks/use-toast";

const AdminCommunity = () => {
  const [tab, setTab] = useState<"reports" | "posts" | "comments">("reports");
  const reports = useAdminTable<any>("content_reports");
  const posts = useAdminTable<any>("community_posts");
  const comments = useAdminTable<any>("community_comments");
  const mReports = useAdminMutate("content_reports");
  const mPosts = useAdminMutate("community_posts");
  const mComments = useAdminMutate("community_comments");

  const resolveReport = async (r: any, status: "resolved" | "dismissed") => {
    const { data } = await supabase.auth.getUser();
    await mReports.update(r.id, {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: data.user?.id ?? null,
    });
  };

  const removeReported = async (r: any) => {
    const table = r.content_type === "comment" ? "community_comments" : "community_posts";
    const { error } = await supabase.from(table as any).delete().eq("id", r.content_id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction("moderation.remove_content", { entity: table, entity_id: r.content_id });
    await resolveReport(r, "resolved");
    posts.refetch();
    comments.refetch();
  };

  const reportCols: Column<any>[] = [
    { key: "content_type", header: "Type", render: (r) => <Badge>{r.content_type}</Badge> },
    { key: "reason", header: "Reason" },
    { key: "description", header: "Details", render: (r) => <span className="block max-w-[260px] truncate text-muted-foreground">{r.description || "—"}</span> },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={r.status === "pending" ? "warn" : r.status === "resolved" ? "success" : "muted"}>{r.status}</Badge>,
    },
    { key: "created_at", header: "Reported", render: (r) => fmtDate(r.created_at) },
    {
      key: "actions",
      header: "",
      render: (r) =>
        r.status === "pending" ? (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => removeReported(r)}>
              Remove
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => resolveReport(r, "dismissed")}>
              Dismiss
            </Button>
          </div>
        ) : null,
    },
  ];

  const postCols: Column<any>[] = [
    { key: "content", header: "Content", render: (r) => <span className="block max-w-[420px] truncate">{r.content}</span> },
    { key: "image_url", header: "Media", render: (r) => (r.image_url ? <Badge tone="success">image</Badge> : "—") },
    { key: "created_at", header: "Posted", render: (r) => fmtDate(r.created_at) },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => mPosts.remove(r.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const commentCols: Column<any>[] = [
    { key: "content", header: "Comment", render: (r) => <span className="block max-w-[420px] truncate">{r.content}</span> },
    { key: "created_at", header: "Posted", render: (r) => fmtDate(r.created_at) },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => mComments.remove(r.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const tabs = [
    { id: "reports", label: `Reports (${(reports.data ?? []).filter((r) => r.status === "pending").length})` },
    { id: "posts", label: "Posts" },
    { id: "comments", label: "Comments" },
  ] as const;

  return (
    <div>
      <PageHeader title="Community & Moderation" subtitle="Review reported content and manage community activity.">
        <div className="flex gap-1 p-0.5 rounded-md bg-muted">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3 py-1 text-xs rounded ${tab === t.id ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {tab === "reports" && (
        <DataTable rows={reports.data} columns={reportCols} loading={reports.isLoading} searchKeys={["reason", "description", "status"]} />
      )}
      {tab === "posts" && <DataTable rows={posts.data} columns={postCols} loading={posts.isLoading} searchKeys={["content"]} />}
      {tab === "comments" && <DataTable rows={comments.data} columns={commentCols} loading={comments.isLoading} searchKeys={["content"]} />}
    </div>
  );
};

export default AdminCommunity;
