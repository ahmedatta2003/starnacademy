import { useState } from "react";
import { PageHeader } from "../components/DataTable";
import { useAdminTable, useAdminMutate } from "../lib/data";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "../lib/audit";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminFeatureFlags = () => {
  const { data, isLoading, refetch } = useAdminTable<any>("feature_flags", { orderBy: "key", ascending: true });
  const { update } = useAdminMutate("feature_flags");
  const [key, setKey] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const k = key.trim();
    if (!k) return;
    setSaving(true);
    const { error } = await supabase.from("feature_flags").insert({ key: k, description: desc || null, enabled: false });
    setSaving(false);
    if (error) {
      toast({ title: "Could not create flag", description: error.message, variant: "destructive" });
      return;
    }
    await logAdminAction("feature_flags.create", { entity: "feature_flags", metadata: { key: k } });
    setKey("");
    setDesc("");
    refetch();
    toast({ title: "Flag created" });
  };

  return (
    <div>
      <PageHeader title="Feature Flags" subtitle="Toggle platform modules without a deploy." />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="flag_key" className="h-9 sm:max-w-[220px]" />
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="h-9 flex-1" />
          <Button onClick={add} disabled={saving || !key.trim()} className="h-9">
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Add flag
          </Button>
        </div>
      </Card>

      <Card className="divide-y divide-border">
        {isLoading && (
          <div className="p-10 text-center">
            <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
          </div>
        )}
        {!isLoading && (data ?? []).length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No feature flags yet.</div>
        )}
        {(data ?? []).map((f) => (
          <div key={f.key} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <code className="text-sm font-medium">{f.key}</code>
              <div className="text-xs text-muted-foreground truncate">{f.description || "No description"}</div>
            </div>
            <Switch checked={!!f.enabled} onCheckedChange={(v) => update(f.key, { enabled: v }, "key")} />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AdminFeatureFlags;
