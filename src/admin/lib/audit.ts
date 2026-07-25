import { supabase } from "@/integrations/supabase/client";

export async function logAdminAction(
  action: string,
  opts: { entity?: string; entity_id?: string; metadata?: Record<string, unknown> } = {}
) {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return;
  await supabase.from("admin_audit_logs").insert({
    actor_id: uid,
    action,
    entity: opts.entity ?? null,
    entity_id: opts.entity_id ?? null,
    metadata: opts.metadata ?? {},
    user_agent: navigator.userAgent,
  });
}
