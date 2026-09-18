# Starn Academy → Hybrid Learning Platform

## What exists today (audit)

- **Public site**: React + Vite + Tailwind + shadcn, Arabic RTL, brand tokens in `index.css`. Landing page sections are already CMS-driven (`site_sections`, `site_content`) and gated by an admin visibility toggle.
- **Auth**: real email/password accounts on Lovable Cloud. Roles live in a separate `user_roles` table (admin, guardian, child, trainer, manager, super_admin), enforced server-side by row-level security.
- **Database**: real PostgreSQL with ~35 tables — profiles, children, guardians, trainers, courses, attendance, homework, grades, skills, placement assessments, learning paths, quiz, community, audit logs. No mock/localStorage data except the admin theme preference.
- **Admin**: `/admin` back office with ~25 pages, mostly read/edit lists over existing tables.
- **Student side**: `/dashboard` plus several standalone dashboard pages. There is **no course → module → lesson model at all**, no enrolments table, no lesson files, no discussions, no live sessions. This is the real gap.

## What this plan builds

The learning platform layer that is genuinely missing, on top of everything above. Landing page, brand, and every working feature stay exactly as they are.

### Phase 1 — Data model (the foundation)

New tables, all with row-level security and proper indexes:

- `course_modules`, `lessons` (title, number, description, thumbnail, instructor, duration, status draft/scheduled/published/archived, release rule + release date, preview fields)
- `enrollments` (student, course, learning mode online/offline/hybrid, status, dates) — this is the access key for everything
- `lesson_progress` (state, completion, last position), `lesson_resources`
- `live_sessions` (provider-agnostic: provider, meeting URL, schedule, status, recording URL)
- `lesson_comments` (+ replies, pinned, answered), `assignments`, `submissions`
- `lesson_files` / `student_files` with owner, visibility, size, type metadata

Access rule everywhere: a student sees a lesson only if it is published, its release date has passed, and they hold an active enrolment in its course. Teachers see their assigned courses. Parents see their children. Admin sees all. Enforced in the database, not in the browser.

Existing `dynamic_courses` stays the course table — modules and lessons hang off it, so current course content and the marketing pages keep working.

### Phase 2 — Student portal

- `/dashboard` becomes a real student home: continue learning, my courses, upcoming lessons and live sessions, pending assignments, progress, notifications.
- `/course/:id` — course dashboard: modules, lessons with clear Locked / Available / In progress / Completed states, resources, assignments.
- `/lesson/:id` — the lesson screen: header (number, title, instructor, duration), main content area, module/lesson sidebar, description and objectives, files, discussion, previous / mark complete / next.
- Every screen ships loading, empty, and error states. No endless spinners.

### Phase 3 — Public learning layer

- New `Learning` entry in the site navigation, plus a public course page showing modules and lesson previews (thumbnail, short blurb, duration, lock badge) that drives registration. Protected content is never sent to a visitor.
- Offline learning stays first-class: an offline student keeps account, attendance, progress, projects, and can be switched to online or hybrid without losing history.

### Phase 4 — Admin management

New admin screens so content is managed without touching code: courses → modules → lessons (create, edit, thumbnail, resources, schedule, publish/unpublish), enrolments (assign students to courses and learning mode), live sessions, files, assignments, discussion moderation.

### Phase 5 — Files and video

- Private storage bucket for lesson media and student submissions, with short-lived signed links issued by the server only after it verifies enrolment. Type and size validation on the server, not just the browser.

### Phase 6 — Verification

Real end-to-end checks in the running app: visitor blocked from a protected lesson; student A blocked from student B's data; student blocked from a course they are not enrolled in; admin publishes a lesson and the enrolled student sees it; mobile and desktop layouts.

## Honest limitations

- **Live classes**: I will build the session model, scheduling, and join screen. I will **not** claim Zoom/Teams/Meet integration — that needs provider accounts and API credentials you supply. Until then a session holds a meeting link an admin pastes in.
- **Video**: signed, expiring URLs from private storage prevent casual downloading, URL sharing, and direct access. No website can prevent screen recording, and I won't pretend otherwise. True DRM streaming needs a provider such as Mux or Cloudflare Stream.
- **Payments**: not implemented. Enrolment stays admin-controlled, modelled so a payment event can create the enrolment later.
- **Lesson content**: left empty with professional placeholders. I will not invent lessons, instructors, or curriculum text.

## Scope note

This is a large build — roughly six phases. I'll work through them in order and report after each, so you can steer before the next one starts. Nothing on the current public site changes visually.
