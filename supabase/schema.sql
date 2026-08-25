-- Teacher Plate — auth + shared class store
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Why relational and not one jsonb blob: Catch Me Up will need per-class records
-- ("what did Period 3 do on Tuesday"), and changing the shape later means a
-- migration against real teacher rosters. Cheaper to get it right now.
--
-- RLS is the ONLY boundary. The anon key is public by design and ships in the
-- browser; every policy below is what actually keeps one teacher's roster out of
-- another teacher's hands.

-- ─────────────────────────────── classes ───────────────────────────────
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references auth.users(id) on delete cascade,
  local_id    text not null,              -- client-side id; makes sync idempotent
  period      text default '',
  subject     text default '',            -- client calls this `name`
  grade       text default '',
  meets_at    text default '',            -- client calls this `time`; `time` is a Postgres type
  unit        text default '',
  notes       text default '',
  color       text default '',
  sort        int  default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (teacher_id, local_id)
);

-- ─────────────────────────────── students ──────────────────────────────
-- First name + single-initial only. No diagnoses, no medical data, no labels —
-- there is deliberately nowhere to put them.
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references auth.users(id) on delete cascade,
  class_id    uuid not null references public.classes(id) on delete cascade,
  local_id    text not null,
  first       text default '',
  last        text default '',            -- one character
  supports    text[] default '{}',
  note        text default '',
  sort        int  default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (teacher_id, local_id)
);

create index if not exists classes_teacher_idx  on public.classes (teacher_id);
create index if not exists students_teacher_idx on public.students (teacher_id);
create index if not exists students_class_idx   on public.students (class_id);

-- ─────────────────────────────── RLS ───────────────────────────────────
alter table public.classes  enable row level security;
alter table public.students enable row level security;

-- Written per-operation rather than "for all" so a mistake in one verb cannot
-- silently widen the others.
drop policy if exists classes_select on public.classes;
drop policy if exists classes_insert on public.classes;
drop policy if exists classes_update on public.classes;
drop policy if exists classes_delete on public.classes;

create policy classes_select on public.classes for select
  using (teacher_id = auth.uid());
create policy classes_insert on public.classes for insert
  with check (teacher_id = auth.uid());
create policy classes_update on public.classes for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy classes_delete on public.classes for delete
  using (teacher_id = auth.uid());

drop policy if exists students_select on public.students;
drop policy if exists students_insert on public.students;
drop policy if exists students_update on public.students;
drop policy if exists students_delete on public.students;

create policy students_select on public.students for select
  using (teacher_id = auth.uid());
create policy students_insert on public.students for insert
  with check (teacher_id = auth.uid());
create policy students_update on public.students for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy students_delete on public.students for delete
  using (teacher_id = auth.uid());

-- ─────────────────────────── grants ────────────────────────────────────
-- RLS decides WHICH ROWS a role may see. GRANT decides whether the role may
-- touch the table at all. Both are required — policies alone give 42501.
--
-- Deliberately NOT granted to `anon`: signed-out teachers use localStorage and
-- never call the API, so the anonymous role has no reason to reach these tables.
-- A keyless or signed-out request failing with 42501 is a stronger guarantee
-- than it succeeding and returning an empty array.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.classes  to authenticated;
grant select, insert, update, delete on public.students to authenticated;

-- ─────────────────────────── updated_at ────────────────────────────────
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists classes_touch  on public.classes;
drop trigger if exists students_touch on public.students;
create trigger classes_touch  before update on public.classes
  for each row execute function public.touch_updated_at();
create trigger students_touch before update on public.students
  for each row execute function public.touch_updated_at();

-- ─────────────────────────── verify ────────────────────────────────────
-- Signed out / keyless, reads must FAIL with 42501 (permission denied) — anon is
-- intentionally not granted anything. Signed in, each teacher must see only their
-- own rows; that is RLS doing its job on top of the grant.
