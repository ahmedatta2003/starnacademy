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
    const { student_id } = await req.json();
    const targetId = student_id || claims.claims.sub;

    // Gather context (RLS enforces access)
    const [intel, evals, attendance, homework, placements] = await Promise.all([
      supabase.from("student_intelligence").select("*").eq("student_id", targetId).maybeSingle(),
      supabase.from("teacher_evaluations").select("overall_rating,notes,created_at").eq("student_id", targetId).order("created_at", { ascending: false }).limit(5),
      supabase.from("attendance").select("status,session_date").eq("student_id", targetId).order("session_date", { ascending: false }).limit(20),
      supabase.from("homework_submissions").select("status,score,title,created_at").eq("student_id", targetId).order("created_at", { ascending: false }).limit(10),
      supabase.from("placement_assessments").select("recommended_level,recommended_course_key,reasoning").eq("student_id", targetId).order("created_at", { ascending: false }).limit(1),
    ]);

    if (!intel.data) {
      return new Response(JSON.stringify({ error: "Student intelligence not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const prompt = `اكتب فقرة قصيرة (3-4 أسطر) بالعربية المصرية الودودة تصف الطالب من منظور تعلّم تكيفي. ركّز على نمط تعلّمه، نقطة قوته الرئيسية، وأول خطوة يحتاج يشتغل عليها.
البيانات:
- المستوى: ${intel.data.current_level}
- المنطق: ${intel.data.logical_thinking_score}/100
- حل المشكلات: ${intel.data.problem_solving_score}/100
- الإبداع: ${intel.data.creativity_score}/100
- سرعة التعلم: ${intel.data.learning_speed}/100
- نقاط القوة: ${(intel.data.strengths || []).join("، ")}
- نقاط الضعف: ${(intel.data.weaknesses || []).join("، ")}
- آخر توصية: ${placements.data?.[0]?.reasoning || "لا يوجد"}
- ملاحظات معلمين: ${evals.data?.map((e: any) => e.notes).filter(Boolean).slice(0, 3).join(" | ") || "لا يوجد"}
- حضور آخر 20 حصة: ${attendance.data?.filter((a: any) => a.status === "present").length || 0}/${attendance.data?.length || 0}
- واجبات مكتملة: ${homework.data?.filter((h: any) => h.status === "reviewed" || h.status === "submitted").length || 0}/${homework.data?.length || 0}

اكتب الفقرة فقط، بدون عناوين.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت مستشار تعليمي متخصص في التعلم التكيفي." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: "AI gateway failed", details: errText }), {
        status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const narrative = data.choices?.[0]?.message?.content?.trim() || "";

    await supabase.from("student_intelligence").update({
      ai_narrative: narrative,
      ai_narrative_updated_at: new Date().toISOString(),
    }).eq("student_id", targetId);

    await supabase.from("ai_events").insert({
      student_id: targetId,
      actor_id: claims.claims.sub,
      module: "profile",
      action: "generate_insight",
      inputs: {},
      output: { narrative },
      model: "google/gemini-2.5-flash",
    });

    return new Response(JSON.stringify({ narrative }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
