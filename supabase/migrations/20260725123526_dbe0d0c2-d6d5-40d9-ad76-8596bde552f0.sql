
-- Admin audit logs
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_audit_logs TO service_role;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read audit" ON public.admin_audit_logs FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins insert audit" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin'::app_role) AND actor_id = auth.uid());
CREATE INDEX idx_admin_audit_created ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_actor ON public.admin_audit_logs(actor_id);

-- Admin sessions / device tracking
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device text,
  user_agent text,
  ip text,
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_sessions TO service_role;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage sessions" ON public.admin_sessions FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(),'admin'::app_role) AND user_id = auth.uid());

-- Feature flags
CREATE TABLE public.feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  description text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.feature_flags TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.feature_flags TO authenticated;
GRANT ALL ON public.feature_flags TO service_role;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flags readable" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "admins write flags" ON public.feature_flags FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins update flags" ON public.feature_flags FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins delete flags" ON public.feature_flags FOR DELETE TO authenticated USING (private.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_feature_flags_updated BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
