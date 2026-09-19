import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PublicCourse = {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  age_range: string | null;
  level: string | null;
  duration: string | null;
  price: string | null;
  icon: string | null;
  features_ar: string[] | null;
  features_en: string[] | null;
  image_url: string | null;
  display_order: number;
};

export const useCourses = () =>
  useQuery({
    queryKey: ["public-courses"],
    queryFn: async (): Promise<PublicCourse[]> => {
      const { data, error } = await supabase
        .from("dynamic_courses")
        .select(
          "id, title_ar, title_en, description_ar, description_en, age_range, level, duration, price, icon, features_ar, features_en, image_url, display_order"
        )
        .eq("is_visible", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as PublicCourse[];
    },
    staleTime: 5 * 60 * 1000,
  });