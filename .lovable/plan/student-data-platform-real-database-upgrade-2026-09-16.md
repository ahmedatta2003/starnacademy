# Student Data Platform — Real Database Upgrade

## Audit result (what already exists)

Good news: this project is **already** on a real, persistent PostgreSQL database (Lovable Cloud / Supabase) with row-level security. There is no fake database — no JSON store, no localStorage student records, no hardcoded student arrays. The only localStorage use is the admin light/dark theme preference, which is correct.

Already live and persistent: student/parent/teacher accounts (`profiles`, `user_roles`, `children`, `guardians`, `trainers`), courses, attendance, homework, skill scores, placement assessments, learning paths, teacher evaluations, parent reports, quiz questions/attempts, AI events, audit logs, feature flags.

So this is **not** a rebuild. It is a set of real gaps to close:

| Gap | Today | Needed |
|---|---|---|
| Enrollments | none — "current course" is a single column | proper `enrollments` table with history |
| Skills | free-text skill names in scores | skills catalogue + per-student skill levels + history |
| Student questions | not stored anywhere | persistent questions & answers |
| Achievements / certificates | JSON blobs inside one row | real tables |
| Student profile fields | name/email/phone only | date of birth, gender, photo, city, governorate, country, school, grade |
| Admin student pages | read-only list of names | create / edit / archive, full profile page, search + filters |
| Lists | fetch up to 1000 rows into the browser, filter in JS | server-side pagination, search, filters |
| Export / import | none | CSV + JSON export, CSV import with validation |
| Roles | admin / guardian / child / trainer | + manager, super admin |

## Delivery plan

### Phase 1 — Schema and data migration
One migration adding: `student_details` (personal/location/school fields), `enrollments`, `skills` catalogue, `student_skills` + `student_skill_history`, `student_questions`, `achievements`, `certificates`, `progress_snapshots`, `activity_logs`. Adds `manager` and `super_admin` roles. Indexes on every foreign key and on the columns used for search and sorting. Access rules: a student sees only their own rows, a parent only their linked children, a teacher only assigned students, admins everything — enforced in the database, not the browser. Existing course/skill/achievement data is copied into the new tables by the migration itself; nothing is deleted.

### Phase 2 — Server-side data layer
Replace the current "load everything then filter in the browser" helper with a paginated query layer: page size, sort, search and filters are sent to the database, only one page comes back. Applied to every admin list. Student lists stay fast at 1,000+ records.

### Phase 3 — Admin student management
- Student list: server-side search (name, email, ID, phone), filters (course, level, school, city, governorate, status, teacher, account status), sorting, pagination.
- Create / edit / archive student, with validation (unique email, valid email format, age and date sanity, progress 0–100, real course and skill IDs).
- Full student profile page with sections: overview, personal, academic, current course, progress, skills, assessments, projects, attendance, questions, achievements, learning path, teacher feedback, AI recommendations, activity history.
- Every create/edit/archive writes an audit entry (who, what, when, before/after).

### Phase 4 — Parents, teachers, enrollments, questions
Admin screens for parent records and child links, teacher records and student assignments, course enrolment management, and the student questions inbox (answer, categorise, close).

### Phase 5 — Export, import, backup
- Export: CSV and JSON per entity, plus a relationship-preserving full JSON export. Runs server-side and streams in batches so large exports do not hang the browser.
- Import: CSV upload with a dry-run validation report before anything is written.
- Backup/restore: documented in `DEPLOYMENT_GUIDE.md`.

### Phase 6 — Verification
Sign in as admin, student and parent in a real browser session and walk the whole flow: create student, edit, archive, enroll, update progress and skills, add and answer a question, run an export, confirm unauthorised users are blocked, confirm data survives reload and sign-out. Existing public pages, dashboards, quiz and AI features re-checked for regressions.

## What I cannot do, and why

- **Managed database backups/restore**: the hosting platform already runs automated backups, but it exposes no API for me to trigger or restore one from inside the app. What I *can* build is the full-data JSON export plus written restore and migration steps. Point-in-time restore has to be requested through support.
- **Raw SQL dump download**: the database password is not available to this app by design, so a `pg_dump` button is not possible. The JSON/CSV export is the supported equivalent.
- **Password hashing, sessions, tokens**: already handled by the platform's auth service. Passwords are never stored by this app.

## Technical notes

- No new backend service: PostgreSQL + row-level security + edge functions for export/import, which is the production path for this stack.
- Every new table gets created-at/updated-at timestamps, an update trigger, foreign keys with sensible delete behaviour, unique constraints and indexes.
- History tables are append-only so "what changed last month" is answerable.
- Deletion is archival (status flag) rather than physical removal, so relationships and audit trail stay intact.
- All schema changes go through migration files, so they are reproducible on any environment.

Phase 1 starts as soon as you approve; I report back after each phase rather than dropping everything unverified at the end.
