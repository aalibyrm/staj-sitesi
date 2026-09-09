create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text,
  category text,
  year integer not null check (year between 2000 and 2100),
  department text,
  cover_image_url text,
  github_url text,
  repository_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  avatar_url text,
  github_url text
);

create table if not exists public.project_students (
  project_id uuid not null references public.projects(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  role text,
  display_order integer not null default 0,
  primary key (project_id, student_id)
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text
);

create table if not exists public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  display_order integer not null default 0,
  primary key (project_id, technology_id)
);

create table if not exists public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null,
  title text not null,
  section_type text not null check (section_type in ('text', 'architecture', 'attack_list', 'metrics', 'chart', 'statistics', 'conclusion', 'gallery')),
  content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  unique (project_id, section_key)
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('hero', 'diagram', 'chart', 'gallery', 'thumbnail')),
  url text not null,
  alt_text text,
  caption text,
  display_order integer not null default 0
);

create index if not exists projects_public_archive_idx
  on public.projects (status, year desc, published_at desc);
create index if not exists project_students_order_idx
  on public.project_students (project_id, display_order);
create index if not exists project_technologies_order_idx
  on public.project_technologies (project_id, display_order);
create index if not exists project_sections_order_idx
  on public.project_sections (project_id, is_visible, display_order);
create index if not exists project_media_order_idx
  on public.project_media (project_id, type, display_order);

alter table public.projects enable row level security;
alter table public.students enable row level security;
alter table public.project_students enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_sections enable row level security;
alter table public.project_media enable row level security;

revoke all on table public.projects from anon, authenticated;
revoke all on table public.students from anon, authenticated;
revoke all on table public.project_students from anon, authenticated;
revoke all on table public.technologies from anon, authenticated;
revoke all on table public.project_technologies from anon, authenticated;
revoke all on table public.project_sections from anon, authenticated;
revoke all on table public.project_media from anon, authenticated;

grant select on table public.projects to anon, authenticated;
grant select on table public.students to anon, authenticated;
grant select on table public.project_students to anon, authenticated;
grant select on table public.technologies to anon, authenticated;
grant select on table public.project_technologies to anon, authenticated;
grant select on table public.project_sections to anon, authenticated;
grant select on table public.project_media to anon, authenticated;

drop policy if exists "published projects are public" on public.projects;
create policy "published projects are public"
  on public.projects for select to anon, authenticated
  using (status = 'published');

drop policy if exists "published project students are public" on public.project_students;
create policy "published project students are public"
  on public.project_students for select to anon, authenticated
  using (exists (
    select 1 from public.projects
    where projects.id = project_students.project_id
      and projects.status = 'published'
  ));

drop policy if exists "students of published projects are public" on public.students;
create policy "students of published projects are public"
  on public.students for select to anon, authenticated
  using (exists (
    select 1 from public.project_students
    join public.projects on projects.id = project_students.project_id
    where project_students.student_id = students.id
      and projects.status = 'published'
  ));

drop policy if exists "published project technologies are public" on public.project_technologies;
create policy "published project technologies are public"
  on public.project_technologies for select to anon, authenticated
  using (exists (
    select 1 from public.projects
    where projects.id = project_technologies.project_id
      and projects.status = 'published'
  ));

drop policy if exists "technologies of published projects are public" on public.technologies;
create policy "technologies of published projects are public"
  on public.technologies for select to anon, authenticated
  using (exists (
    select 1 from public.project_technologies
    join public.projects on projects.id = project_technologies.project_id
    where project_technologies.technology_id = technologies.id
      and projects.status = 'published'
  ));

drop policy if exists "visible sections of published projects are public" on public.project_sections;
create policy "visible sections of published projects are public"
  on public.project_sections for select to anon, authenticated
  using (
    is_visible
    and exists (
      select 1 from public.projects
      where projects.id = project_sections.project_id
        and projects.status = 'published'
    )
  );

drop policy if exists "media of published projects are public" on public.project_media;
create policy "media of published projects are public"
  on public.project_media for select to anon, authenticated
  using (exists (
    select 1 from public.projects
    where projects.id = project_media.project_id
      and projects.status = 'published'
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "project media objects are publicly readable" on storage.objects;
create policy "project media objects are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-media');
