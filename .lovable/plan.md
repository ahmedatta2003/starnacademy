
# Starn Academy — Admin Panel V2 (EduOS Back Office)

This is a very large scope. I'll deliver it in **phases** so each turn ships working, verified code instead of a giant unverified drop. Nothing in the Student / Parent / Teacher / Public site changes except a hidden `/admin` entry.

## Scope corrections vs. the master prompt

Some items in the prompt don't match this project's real stack. I'll adapt, not fake:

- **Stack is fixed**: React + Vite + TS + Tailwind + shadcn + Supabase (Lovable Cloud). No Prisma / Express / Node server — Supabase is the backend, edge functions are the server layer. I'll build clean architecture *within* that stack.
- **Auth is Supabase Auth** (single identity system). "Isolated admin auth" = a dedicated `/admin/login` route + admin-only guards + `user_roles.role='admin'` + audit logging + session/device tracking table. We cannot fork Supabase Auth into a second system without breaking every existing feature.
- **2FA / email verification / refresh tokens / secure cookies** are handled by Supabase; I'll expose the switches (HIBP already on) and add TOTP-ready UI hooks, not reimplement them.
- **First super admin**: already handled by the `handle_new_user` trigger for `starnacademy.school@gmail.com`. I will NOT hardcode the password in code or migrations. A seeder is unnecessary — the trigger auto-promotes on first signup.
- **Modules with no data model yet** (Finance, CRM, HR, Inventory, Branches, Rooms, Marketing campaigns, Coupons, Referrals, Feature Flags, API Keys, Backups, etc.) will be **scaffolded as real pages with real tables when the domain is clear**, or marked as "Phase N" stubs that are hidden from the sidebar until built — no placeholder pages shipped to production.

## Phased delivery

### Phase 1 — Foundation (this next turn)
1. **Delete old admin surface**: remove `/admin/cms` route wiring, `src/pages/AdminCMS.tsx`, `src/pages/AdminDashboard.tsx`, `src/components/admin/*`, `src/components/AdminReportsPanel.tsx`. Remove any header/nav links pointing to them.
2. **New admin shell** under `/admin/*`:
   - `/admin/login` — dedicated login page (Supabase Auth, admin-role gate, failed-login logging).
   - `AdminLayout` with collapsible sidebar (shadcn `Sidebar`), topbar (search, theme toggle, user menu), dark/light mode, responsive.
   - `AdminGuard` HOC: checks `user_roles.role='admin'`, else 403.
   - Route-level code splitting via `React.lazy`.
3. **Database (one migration)**:
   - `admin_audit_logs` (actor_id, action, entity, entity_id, metadata, ip, ua, created_at)
   - `admin_sessions` (user_id, device, ua, ip, last_seen, created_at)
   - `admin_permissions` enum + `role_permissions` table (RBAC layer on top of existing `app_role`)
   - `feature_flags` (key, enabled, description, updated_by)
   - GRANTs + RLS: admin-only via `has_role(auth.uid(),'admin')`.
4. **Dashboard home**: real KPIs from existing tables — students count, guardians count, trainers, bookings today/month, quiz attempts, AI events, community posts, storage/DB health via `supabase--db_health`-style client queries. Charts with `recharts` (already installed via shadcn).

### Phase 2 — Core operations
- **Students**, **Parents**, **Teachers**: full CRUD tables (data table, filters, pagination, drawer detail views) reading `profiles`, `children`, `guardians`, `trainers`, `student_intelligence`, `skill_scores`, `attendance`, `homework_submissions`, `parent_reports`, `teacher_evaluations`, `teacher_assignments`.
- **Bookings & Attendance**: `course_bookings`, `free_session_bookings`, `attendance`.
- **LMS**: `dynamic_courses`, `learning_paths`, `quiz_questions` (moves the old AdminQuiz into new shell, rebuilt).
- **Website CMS**: `site_content`, `site_sections`, `parent_testimonials`, `partners`, `students_showcase` — rebuilt from scratch in new shell (replaces old AdminTexts/Sections/Testimonials/Courses/Media).
- **Content Moderation**: `content_reports`, `community_posts`, `community_comments`.

### Phase 3 — Intelligence & Ops
- **AI**: gateway usage from `ai_events`, prompt template editor (new `ai_prompt_templates` table), per-module toggles via `feature_flags`.
- **Analytics**: executive KPIs, retention, completion, growth, AI usage — powered by SQL views.
- **Security**: audit log viewer, session/device history, failed logins, RBAC/permissions editor.
- **Settings**: brand, SEO, social, integrations (Resend etc.), notifications.

### Phase 4 — Deferred domains (only when the business defines them)
Finance, CRM, HR, Inventory, Branches, Rooms, Marketing campaigns, Coupons, Referrals, Backups. These need real requirements from the user (pricing model, currency, payroll rules, etc.) before I build schema. They will NOT appear in the sidebar until defined — no dead pages.

## Technical section

- **Folder layout**
  - `src/admin/` — self-contained module: `layout/`, `pages/`, `components/`, `hooks/`, `lib/`, `guards/`.
  - `src/admin/routes.tsx` mounted once in `App.tsx` at `/admin/*` behind lazy import.
- **Data access**: one `useAdminQuery` wrapper around `@tanstack/react-query` + supabase client. Repository-style modules per entity: `src/admin/lib/repos/students.ts`, etc.
- **Forms**: `react-hook-form` + `zod` (already in project) with shared `<AdminForm>` primitives.
- **Audit**: every write goes through a `logAdminAction()` helper that inserts into `admin_audit_logs`.
- **RLS**: all new admin tables — `SELECT/INSERT/UPDATE/DELETE` restricted to `has_role(auth.uid(),'admin')` from `private` schema.
- **Theming**: dark/light via existing tokens in `index.css`; admin uses a denser typographic scale but same brand tokens (no new palette).
- **Perf**: `React.lazy` per admin page, `Suspense` boundaries, virtualized tables (`@tanstack/react-virtual`) for >500 rows.
- **Public site**: only change is a single hidden entry (Ctrl+Shift+A shortcut + `/admin` route). Header/MobileMenu admin link removed.

## What ships in the next turn (Phase 1 only)

1. Migration: `admin_audit_logs`, `admin_sessions`, `feature_flags` (+ RLS + GRANTs).
2. Delete old admin files & references.
3. New `/admin/login`, `/admin` shell, `AdminGuard`, sidebar, topbar, dark/light.
4. Real dashboard with live KPIs from existing tables.
5. Hidden entry (`Ctrl+Shift+A` + typed `/admin`).
6. Typecheck + preview verification.

After Phase 1 lands and you confirm it looks right, I move to Phase 2. Please confirm this plan (or tell me which modules to reprioritize) and I'll start Phase 1.
