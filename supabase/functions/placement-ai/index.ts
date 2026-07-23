import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COURSE_MAP: Record<string, { title: string; duration_weeks: number }> = {
  genius: { title: "المبرمج الواعد (شهرين)", duration_weeks: 8 },
  stars: { title: "نجوم الغد (٤ شهور)", duration_weeks: 16 },
  diploma: { title: "الدبلومة المتكاملة (٦ شهور)", duration_weeks: 24 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const studentId = claimsData.claims.sub as string;

    const body = await req.json();
    const {
      name,
      age,
      prior_experience,
      self_confidence,
      target_course,
      answers,
      score,
      total,
      final_level,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const systemPrompt = `أنت مستشار تعليمي ذكي في أكاديمية Starn لتعليم البرمجة للأطفال.
مهمتك: تحليل نتائج اختبار تحديد المستوى وتقديم توصية دقيقة ومبررة.
الكورسات المتاحة:
- genius: المبرمج الواعد (شهرين) — للمبتدئين تمامًا
- stars: نجوم الغد (٤ شهور) — لمن لديه أساس بسيط
- diploma: الدبلومة المتكاملة (٦ شهور) — لمن يريد إتقان متقدم

قيّم الطالب على ٦ أبعاد بدرجات من 0 إلى 100:
logical_thinking, problem_solving, creativity, digital_literacy, communication, learning_speed.

أعِد JSON فقط بهذا الشكل بالضبط:
{
  "recommended_level": "beginner|intermediate|advanced",
  "recommended_course_key": "genius|stars|diploma",
  "expected_duration_weeks": number,
  "confidence": number 0-1,
  "dimension_scores": { "logical_thinking": n, "problem_solving": n, "creativity": n, "digital_literacy": n, "communication": n, "learning_speed": n },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "prerequisites": ["..."],
  "roadmap": [ { "title": "...", "focus": "...", "weeks": n } ],
  "reasoning": "شرح تفصيلي بالعربية لماذا هذه التوصية."
}`;

    const userPrompt = `بيانات الطالب:
- الاسم: ${name}
- السن: ${age}
- خبرة سابقة: ${prior_experience || "غير محدد"}
- الثقة بالنفس (1-10): ${self_confidence || "غير محدد"}
- الكورس المطلوب: ${target_course}
- النتيجة: ${score}/${total} (${percentage}%)
- المستوى النهائي في الاختبار التكيفي: ${final_level}

الإجابات التفصيلية:
${JSON.stringify(answers, null, 2)}

حلل هذه البيانات وقدّم التوصية.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI gateway failed", status: response.status, details: errText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiJson = await response.json();
    const content = aiJson.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      // fallback: use heuristic
      let fallbackKey = target_course;
      if (percentage >= 80 && target_course === "genius") fallbackKey = "stars";
      else if (percentage >= 80 && target_course === "stars") fallbackKey = "diploma";
      else if (percentage < 40 && target_course === "diploma") fallbackKey = "stars";
      else if (percentage < 40 && target_course === "stars") fallbackKey = "genius";
      parsed = {
        recommended_level: final_level === "hard" ? "advanced" : final_level === "medium" ? "intermediate" : "beginner",
        recommended_course_key: fallbackKey,
        expected_duration_weeks: COURSE_MAP[fallbackKey]?.duration_weeks ?? 8,
        confidence: 0.5,
        dimension_scores: {},
        strengths: [],
        weaknesses: [],
        prerequisites: [],
        roadmap: [],
        reasoning: "لم يتمكن الذكاء الاصطناعي من إنتاج تحليل مفصل — تم الاعتماد على النتيجة العددية.",
      };
    }

    // Save placement
    const { data: placement, error: insertErr } = await supabase
      .from("placement_assessments")
      .insert({
        student_id: studentId,
        age,
        prior_experience,
        self_confidence,
        target_course,
        answers,
        dimension_scores: parsed.dimension_scores || {},
        recommended_level: parsed.recommended_level,
        recommended_course_key: parsed.recommended_course_key,
        roadmap: parsed.roadmap || [],
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        prerequisites: parsed.prerequisites || [],
        expected_duration_weeks: parsed.expected_duration_weeks,
        confidence: parsed.confidence,
        reasoning: parsed.reasoning,
      })
      .select()
      .single();

    if (insertErr) console.error("insert placement error:", insertErr);

    // Log ai event
    await supabase.from("ai_events").insert({
      student_id: studentId,
      actor_id: studentId,
      module: "placement",
      action: "recommend_course",
      inputs: { age, target_course, score, total, final_level },
      output: parsed,
      reasoning: parsed.reasoning,
      model: "google/gemini-2.5-flash",
    });

    // Create/refresh learning path
    if (parsed.roadmap?.length && placement) {
      await supabase.from("learning_paths").insert({
        student_id: studentId,
        title: COURSE_MAP[parsed.recommended_course_key]?.title || "مسار مخصص",
        stages: parsed.roadmap,
        eta_weeks: parsed.expected_duration_weeks,
        source: "ai",
      });
    }

    // Seed skill scores
    if (parsed.dimension_scores) {
      const rows = Object.entries(parsed.dimension_scores).map(([skill, score]) => ({
        student_id: studentId,
        skill,
        score: Number(score) || 0,
        source: "placement",
        source_id: placement?.id,
      }));
      if (rows.length) await supabase.from("skill_scores").insert(rows);
    }

    // Update intelligence
    await supabase.from("student_intelligence").upsert({
      student_id: studentId,
      current_level: parsed.recommended_level,
      logical_thinking_score: parsed.dimension_scores?.logical_thinking ?? 0,
      problem_solving_score: parsed.dimension_scores?.problem_solving ?? 0,
      creativity_score: parsed.dimension_scores?.creativity ?? 0,
      communication_score: parsed.dimension_scores?.communication ?? 0,
      learning_speed: parsed.dimension_scores?.learning_speed ?? 0,
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      recommended_improvements: parsed.prerequisites || [],
    }, { onConflict: "student_id" });

    return new Response(
      JSON.stringify({ ...parsed, placement_id: placement?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("placement-ai error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
