import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logAdminAction } from "./audit";

export function useAdminTable<T = any>(
  table: string,
  opts: { select?: string; orderBy?: string; ascending?: boolean; limit?: number } = {}
) {
  const { select = "*", orderBy = "created_at", ascending = false, limit = 1000 } = opts;
  return useQuery<T[]>({
    queryKey: ["admin", table, select, orderBy, ascending, limit],
    queryFn: async () => {
      let q = supabase.from(table as any).select(select).limit(limit);
      if (orderBy) q = q.order(orderBy, { ascending });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useAdminMutate(table: string) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ predicate: (query) => query.queryKey[0] === "admin" && query.queryKey[1] === table });

  const update = async (id: string, patch: Record<string, any>, idKey = "id") => {
    const { error } = await supabase.from(table as any).update(patch).eq(idKey, id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return false;
    }
    await logAdminAction(`${table}.update`, { entity: table, entity_id: id, metadata: patch });
    invalidate();
    toast({ title: "Saved" });
    return true;
  };

  const remove = async (id: string, idKey = "id") => {
    const { error } = await supabase.from(table as any).delete().eq(idKey, id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return false;
    }
    await logAdminAction(`${table}.delete`, { entity: table, entity_id: id });
    invalidate();
    toast({ title: "Deleted" });
    return true;
  };

  return { update, remove, invalidate };
}
