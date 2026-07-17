-- ============================================================================
-- Student Portal — Supabase setup
-- Paste this whole file into Supabase Dashboard → SQL Editor → New query → Run.
--
-- BEFORE running the storage policy section, create the bucket manually:
--   Dashboard → Storage → New bucket → name: "course-material" → PRIVATE (not public).
--
-- AFTER running this file, disable public signups so only invited students
-- can log in:
--   Dashboard → Authentication → Providers → Email → toggle OFF "Allow new
--   users to sign up".
--
-- To enroll a student:
--   1. Dashboard → Authentication → Users → Invite user (enter their email).
--      Supabase emails them a magic link to set a password.
--   2. Run: insert into public.students (id, full_name, class_track)
--      values ('<their-auth-user-uuid>', 'Jane Doe', 'class11-neet');
--      (grab the uuid from the Users table after they accept the invite)
--   3. Upload their files under course-material/<class_track>/... and any
--      shared files under course-material/common/...
-- ============================================================================

-- 1. students table -----------------------------------------------------
create table if not exists public.students (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null,
    class_track text not null check (
        class_track in (
            'foundation-10',
            'class11-neet',
            'class11-jee',
            'class12-neet',
            'class12-jee'
        )
    ),
    active boolean not null default true,
    created_at timestamptz not null default now()
);

alter table public.students enable row level security;

drop policy if exists "students can read own row" on public.students;
create policy "students can read own row"
    on public.students
    for select
    to authenticated
    using (auth.uid() = id);

-- 2. storage.objects RLS for the 'course-material' bucket ---------------
-- NOTE: create the "course-material" bucket as PRIVATE in the Dashboard
-- (Storage → New bucket) before this policy has any effect. Folder layout
-- inside the bucket: course-material/common/... and
-- course-material/<class_track>/... (class_track values match the check
-- constraint above).

drop policy if exists "students can read own track + common files" on storage.objects;
create policy "students can read own track + common files"
    on storage.objects
    for select
    to authenticated
    using (
        bucket_id = 'course-material'
        and (storage.foldername(name))[1] in (
            'common',
            (
                select class_track
                from public.students
                where id = auth.uid()
                  and active
            )
        )
    );
