import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

type ContentRow = {
  section: string;
  content_key: string;
  value_ar: string | null;
  value_en: string | null;
};

let cache: Record<string, ContentRow> | null = null;
let inflight: Promise<Record<string, ContentRow>> | null = null;
const listeners = new Set<() => void>();

const fetchContent = async (): Promise<Record<string, ContentRow>> => {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("section, content_key, value_ar, value_en");

    const map: Record<string, ContentRow> = {};
    if (!error && data) {
      for (const row of data) {
        map[`${row.section}.${row.content_key}`] = row as ContentRow;
      }
    }
    cache = map;
    inflight = null;
    listeners.forEach((l) => l());
    return map;
  })();

  return inflight;
};

export const invalidateSiteContent = () => {
  cache = null;
  inflight = null;
  listeners.forEach((l) => l());
};

/**
 * useSiteContent
 *
 * Returns a `c(section, key, fallbackAr, fallbackEn?)` function.
 * If admin has set a value in the DB, it is returned (in current language).
 * Otherwise the static fallback is used → zero visual break.
 */
export const useSiteContent = () => {
  const { language } = useLanguage();
  const [, force] = useState(0);

  useEffect(() => {
    const tick = () => force((n) => n + 1);
    listeners.add(tick);
    if (!cache) fetchContent();
    return () => {
      listeners.delete(tick);
    };
  }, []);

  const c = (
    section: string,
    key: string,
    fallbackAr: string,
    fallbackEn?: string
  ): string => {
    const row = cache?.[`${section}.${key}`];
    if (row) {
      const v = language === "ar" ? row.value_ar : row.value_en;
      if (v && v.trim().length > 0) return v;
    }
    if (language === "ar") return fallbackAr;
    return fallbackEn ?? fallbackAr;
  };

  return { c };
};
