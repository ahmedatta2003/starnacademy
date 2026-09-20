import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const BUCKET = "lesson-videos";
const EXPIRES_IN = 60 * 60; // 1 hour

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const { lesson_id } = (await req.json().catch(() => ({}))) ?? {};
    if (!lesson_id) return json({ error: "lesson_id is required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: lesson, error: lessonErr } = await admin
      .from("lessons")
      .select("id, course_id, status, release_at, content_kind, content_path")
      .eq("id", lesson_id)
      .maybeSingle();
    if (lessonErr) return json({ error: lessonErr.message }, 400);
    if (!lesson) return json({ error: "Lesson not found" }, 404);

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    const isStaff = (roles ?? []).some((r: { role: string }) =>
      ["admin", "super_admin", "manager", "trainer"].includes(r.role)
    );

    if (!isStaff) {
      // Lesson must be published and released
      const released =
        lesson.status === "published" &&
        (!lesson.release_at || new Date(lesson.release_at as string) <= new Date());
      if (!released) return json({ error: "Lesson is not published yet" }, 403);

      // Caller must have an active enrollment in the course
      const { data: enrollment } = await admin
        .from("enrollments")
        .select("id")
        .eq("student_id", userId)
        .eq("course_id", lesson.course_id)
        .eq("status", "active")
        .maybeSingle();
      if (!enrollment) return json({ error: "Not enrolled in this course" }, 403);
    }

    if (lesson.content_kind !== "video" || !lesson.content_path) {
      return json({ error: "No video attached to this lesson" }, 404);
    }

    const { data: signed, error: signErr } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(lesson.content_path as string, EXPIRES_IN);
    if (signErr || !signed) return json({ error: signErr?.message ?? "Could not sign URL" }, 400);

    return json({ url: signed.signedUrl, expires_in: EXPIRES_IN });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
