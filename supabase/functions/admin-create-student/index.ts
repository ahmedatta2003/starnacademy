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

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // Authorize: caller must be admin / super_admin / manager
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const allowed = (roles ?? []).some((r: { role: string }) =>
      ["admin", "super_admin", "manager"].includes(r.role)
    );
    if (!allowed) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const {
      email,
      password,
      full_name,
      phone,
      date_of_birth,
      city,
      governorate,
      school_name,
      grade_level,
      bio,
    } = body ?? {};

    if (!email || !password || !full_name) {
      return json({ error: "email, password and full_name are required" }, 400);
    }
    if (String(password).length < 8) {
      return json({ error: "Password must be at least 8 characters" }, 400);
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: "child", phone: phone ?? "" },
    });
    if (createErr) return json({ error: createErr.message }, 400);

    const id = created.user!.id;

    const { error: profErr } = await admin
      .from("profiles")
      .update({
        full_name,
        email,
        phone: phone || null,
        date_of_birth: date_of_birth || null,
        city: city || null,
        governorate: governorate || null,
        school_name: school_name || null,
        grade_level: grade_level || null,
        bio: bio || null,
        status: "active",
      })
      .eq("id", id);
    if (profErr) return json({ error: profErr.message }, 400);

    await admin.from("admin_audit_logs").insert({
      actor_id: userData.user.id,
      action: "students.create",
      entity: "profiles",
      entity_id: id,
      metadata: { email, full_name },
    });

    return json({ id, email });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
