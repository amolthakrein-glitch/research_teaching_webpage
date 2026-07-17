## Interim open-access mode

`portal.js` currently has `OPEN_ACCESS = true`. This means the portal skips
login entirely: visiting `portal.html` shows a track picker instead of a
per-student dashboard, and anyone with the link can browse/download course
material for any track — no signup, invite, or password needed.

While this is on:
- Step 2 below (disable public signups) can be deferred — no one signs up anyway.
- Step 6 below (invite/enroll students) can be deferred — there's no per-student login to gate.
- The anon read policy at the bottom of `portal/setup.sql` ("interim open
  access read") **must** be run, or file listing/downloads will fail with 403.

To go back to authenticated access later: set `OPEN_ACCESS = false` in
`portal.js`, then in Supabase SQL Editor run
`drop policy if exists "interim open access read" on storage.objects;`,
and complete steps 2 and 6 below.

---

# Student Portal — One-Time Setup (manual, ~15 min)

The site code is done. These dashboard steps are yours (they can't be scripted from a static site):

## 1. Create the Supabase project
1. https://supabase.com → New project (free tier). Name: `thakre-portal`. Region: `ap-south-1` (Mumbai).
2. Note two values from **Project Settings → API**: the **Project URL** and the **anon public key**.

## 2. Configure auth
1. **Authentication → Providers → Email**: enable Email provider, **turn OFF "Allow new users to sign up"**. This is what enforces "registered students only".
2. (Optional) Set the site URL under Auth → URL Configuration to `https://amolthakrein-glitch.github.io/research_teaching_webpage/portal.html` so invite/reset emails redirect correctly.

## 3. Run the SQL
SQL Editor → paste the whole of `portal/setup.sql` → Run. Creates the `students` table + RLS policies.

## 4. Create the storage bucket
1. **Storage → New bucket**: name `course-material`, **Private** (public OFF).
2. Create folders: `common/`, `foundation-10/`, `class11-neet/`, `class11-jee/`, `class12-neet/`, `class12-jee/`. Upload material into the matching folder — that alone controls who sees it.

## 5. Wire the site
Edit `portal.js` lines 7–8: replace `YOUR_PROJECT_URL` / `YOUR_ANON_KEY` with the values from step 1. The anon key is safe to commit — access control lives in the RLS policies, never in the key.

## 6. Enroll a student (repeat per student)
1. **Authentication → Users → Invite user** → student's email. They receive a set-password link.
2. Copy their user UUID from the users list, then SQL Editor:
   ```sql
   insert into public.students (id, full_name, class_track)
   values ('<uuid>', 'Student Name', 'class11-neet');
   ```
3. To suspend access without deleting: `update public.students set active = false where id = '<uuid>';`

## 7. Verify end-to-end (do this once with a test account)
- Login at `portal-login.html` → lands on `portal.html`, shows name + track badge.
- Student sees only `common/` + their own track's files; a second test account on a different track sees a different list.
- Download works (signed URL, 60-min expiry); the same storage URL pasted in a logged-out browser tab returns 400/403.
- Logged-out visit to `portal.html` bounces to `portal-login.html`.
