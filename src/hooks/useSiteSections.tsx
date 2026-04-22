import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SectionRow = {
  section_key: string;
  is_visible: boolean;
  display_order: number;
};

let cache: Record<string, SectionRow> | null = null;
let inflight: Promise<Record<string, SectionRow>> | null = null;
const listeners = new Set<() => void>();

const fetchSections = async (): Promise<Record<string, SectionRow>> => {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("site_sections")
      .select("section_key, is_visible, display_order");
    const map: Record<string, SectionRow> = {};
    if (!error && data) {
      for (const row of data) map[row.section_key] = row as SectionRow;
    }
    cache = map;
    inflight = null;
    listeners.forEach((l) => l());
    return map;
  })();
  return inflight;
};

export const invalidateSiteSections = () => {
  cache = null;
  inflight = null;
  listeners.forEach((l) => l());
};

/**
 * Returns whether a homepage section should render.
 * Defaults to visible (true) until data loads or if the row is missing —
 * preserves the existing UI when CMS rows aren't seeded yet.
 */
export const useSectionVisible = (sectionKey: string): boolean => {
  const [, force] = useState(0);
  useEffect(() => {
    const tick = () => force((n) => n + 1);
    listeners.add(tick);
    if (!cache) fetchSections();
    return () => {
      listeners.delete(tick);
    };
  }, []);

  const row = cache?.[sectionKey];
  if (!row) return true;
  return row.is_visible;
};
