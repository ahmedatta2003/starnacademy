import { supabase } from "@/integrations/supabase/client";

/**
 * Requests a short-lived signed URL for a lesson video.
 * The backend only issues one for staff, or for enrolled students
 * when the lesson is published and released.
 */
export async function getLessonVideoUrl(lessonId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("lesson-video-url", {
    body: { lesson_id: lessonId },
  });
  if (error) throw new Error(error.message);
  if (!data?.url) throw new Error(data?.error ?? "Video unavailable");
  return data.url as string;
}
