import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims } = await supabase.auth.getClaims(token);
    if (!claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { student_id, period = "weekly" } = await req.json();
    if (!student_id) {
      return new Response(JSON.stringify({ error: "student_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const days = period === "monthly" ? 30 : 7;
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - days * 86400000);

    const [profile, intel, evals, attendance, homework] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", student_id).maybeSingle(),
      supabase.from("student_intelligence").select("*").eq("student_id", student_id).maybeSingle(),
      supabase.from("teacher_evaluations").select("*").eq("student_id", student_id).gte("created_at", periodStart.toISOString()),
      supabase.from("attendance").select("*").eq("student_id", student_id).gte("session_date", periodStart.toISOString().slice(0, 10)),
      supabase.from("homework_submissions").select("*").eq("student_id", student_id).gte("created_at", periodStart.toISOString()),
    ]);

    const attendanceRate = attendance.data?.length
      ? Math.round((attendance.data.filter((a: any) => a.status === "present").length / attendance.data.length) * 100)
      : 0;
    const homeworkDone = homework.data?.filter((h: any) => h.status === "submitted" || h.status === "reviewed").length || 0;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const prompt = `اكتب تقرير ${period === "monthly" ? "شهري" : "أسبوعي"} لولي الأمر بالعربية المصرية البسيطة والودودة عن الطالب ${profile.data?.full_name || ""}.
لا تستخدم مصطلحات تقنية. خلّي اللغة إنسانية ومشجعة حتى لو فيه مشاكل.

بيانات الفترة (${periodStart.toISOString().slice(0, 10)} إلى ${periodEnd.toISOString().slice(0, 10)}):
- نسبة الحضور: ${attendanceRate}%
- واجبات مكتملة: ${homeworkDone}/${homework.data?.length || 0}
- تقييمات المعلمين: ${evals.data?.length || 0}
- المتوسط: ${evals.data?.length ? (evals.data.reduce((s: number, e: any) => s + (e.overall_rating || 0), 0) / evals.data.length).toFixed(1) : "لا يوجد"}
- نقاط القوة الحالية: ${(intel.data?.strengths || []).join("، ")}
- نقاط الضعف: ${(intel.data?.weaknesses || []).join("، ")}

أعِد JSON فقط بهذا الشكل:
{
  "summary": "فقرة ملخص عامة",
  "what_happened": "ماذا حصل خلال الفترة",
  "why_it_happened": "ليه حصل ده",
  "improvements": "أهم تحسّن",
  "support_areas": "المناطق اللي محتاجة دعم",
  "home_actions": "نصائح عملية للأب/الأم في البيت",
  "next_milestone": "المرحلة الجاية المتوقعة",
  "risk_alerts": ["إن وجدت"]
}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت مستشار تربوي بيكتب لولي الأمر بأسلوب داعم ومفهوم." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: "AI gateway failed", details: errText }), {
        status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

    const { data: report, error: insertErr } = await supabase.from("parent_reports").insert({
      student_id,
      period,
      period_start: periodStart.toISOString().slice(0, 10),
      period_end: periodEnd.toISOString().slice(0, 10),
      summary: parsed.summary || "",
      what_happened: parsed.what_happened,
      why_it_happened: parsed.why_it_happened,
      improvements: parsed.improvements,
      support_areas: parsed.support_areas,
      home_actions: parsed.home_actions,
      next_milestone: parsed.next_milestone,
      risk_alerts: parsed.risk_alerts || [],
      metrics: { attendance_rate: attendanceRate, homework_done: homeworkDone, evaluations: evals.data?.length || 0 },
    }).select().single();

    if (insertErr) throw insertErr;

    await supabase.from("ai_events").insert({
      student_id,
      actor_id: claims.claims.sub,
      module: "parent_report",
      action: "generate_report",
      inputs: { period },
      output: parsed,
      model: "google/gemini-2.5-flash",
    });

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
