
# AI Education OS — Phased Build Plan

This is a large, multi-module system. To ship it safely without breaking the current site, I'll build it in 4 phases on top of what already exists (Supabase, Quiz, StudentProfile, Admin CMS, Parent/Student dashboards). Each phase is independently deployable.

Before I start, I need a few decisions from you (see end).

---

## Architecture: Shared Knowledge Layer

One central set of Supabase tables that every module reads/writes. No duplicated data.

```text
                 ┌─────────────────────────────┐
                 │  student_intelligence (core)│
                 │  — one row per student      │
                 └───────────┬─────────────────┘
        ┌────────────┬───────┼────────┬─────────────┐
        ▼            ▼       ▼        ▼             ▼
 placement_    skill_      learning_  ai_events   parent_
 assessments   scores      paths      (audit)     reports
```

New tables (all with RLS + GRANTs):
- `placement_assessments` — every intake attempt, answers, AI verdict, explanation
- `student_intelligence` — live profile: skills, scores, predictions, risk, next course
- `skill_scores` — time-series per skill (logic, problem-solving, creativity, etc.)
- `learning_paths` — assigned roadmap (stages, status, ETA), editable by admin
- `ai_events` — every AI decision + reasoning (audit trail for "explainability")
- `teacher_evaluations` — teacher feedback that feeds the profile
- `parent_reports` — generated weekly/monthly narratives
- `attendance` + `homework_submissions` (if not already covered)

Existing tables reused: `profiles`, `children`, `guardians`, `dynamic_courses`, `quiz_questions`, `quiz_attempts`, `student_projects`.

---

## Phase 1 — Assessment & Placement AI (module 6)

- Extend intake: age, prior experience, self-rated confidence, target course.
- Expand `quiz_questions` with dimension tags (logic, problem_solving, creativity, digital_literacy, comm, speed).
- Edge function `placement-ai`: takes attempt → calls Lovable AI (Gemini) → returns `{ level, recommended_course, roadmap[], strengths[], weaknesses[], prerequisites[], expected_duration_weeks, confidence, reasoning }`. Stored in `placement_assessments` + `ai_events`.
- New `/placement` flow (replaces current quiz results screen) showing the explained recommendation.
- Reassessment supported (new attempt, history kept).

## Phase 2 — Student Intelligence Profile (module 7)

- `student_intelligence` auto-updates via triggers/edge function whenever a lesson, quiz, project, attendance, or teacher evaluation is written.
- Rewrite `StudentProfile.tsx` to render live data instead of the current hardcoded `studentPersonalization.ts` (kept as fallback for demo students).
- Sections: skills radar, learning speed, consistency, risk indicators, predicted success, next course, badges, milestones.
- `generate-profile-insight` edge function produces the AI-written narrative on demand + caches it.

## Phase 3 — Parent Intelligence Dashboard (module 8)

- New `/dashboard/parent` view (extends existing ParentDashboard).
- Weekly + monthly AI-generated reports via `generate-parent-report` edge function → stored in `parent_reports`.
- Sections: progress, attendance, skills gained/needed, teacher notes, AI recommendations, home activities, risk alerts, next milestone.
- Simple, non-technical Arabic tone.
- Optional email delivery (Resend, if you want it — see question below).

## Phase 4 — Admin Control + Integration Glue

- Extend `AdminCMS` with new tabs: Placement Questions (dimensions), Students (search/filter/export), AI Decisions (audit + override), Learning Paths, Parent Reports.
- Admin can override any AI recommendation; override is logged in `ai_events`.
- Executive KPIs tab: anonymized academy-wide metrics (avg level, at-risk %, completion, throughput).
- Wire the journey end-to-end: signup → placement → path → tracking → profile → parent report → advancement.

---

## Technical notes

- All AI calls go through Lovable AI Gateway (`google/gemini-2.5-flash` for fast writes, `gemini-2.5-pro` for reports). No user API keys.
- Every AI response is stored with its prompt + reasoning in `ai_events` for auditability.
- RLS: students see own profile; parents see linked children only (via `guardians`/`children`); teachers see assigned students; admin sees all — enforced via `has_role` + a new `is_guardian_of(child_id)` security-definer function.
- Realtime updates on `student_intelligence` for live dashboards.
- All new UI stays in the current RTL Arabic design system — no visual/brand change.

---

## Questions before I start

1. **Scope of first shipment** — should I build all 4 phases now (large migration, ~2–3 long turns), or ship Phase 1 (Placement AI) first so you can try it, then continue?
2. **Teachers** — do you already have a "teacher/instructor" role and a way to link teachers ↔ students? I see `InstructorDashboard.tsx` but no assignment table. Should I add one?
3. **Parent → child link** — should I rely on the existing `guardians` + `children` tables, or do parents log in with the same account as their child?
4. **Parent email reports** — do you want auto-emailed weekly reports (needs Resend), or in-dashboard only for now?
