begin;

insert into public.projects (
  id, slug, title, year, status
)
values (
  '99999999-9999-4999-8999-999999999999',
  'rls-private-project',
  'RLS private project',
  2026,
  'draft'
)
on conflict (slug) do update set status = 'draft';

insert into public.project_sections (
  id, project_id, section_key, title, section_type, content, display_order, is_visible
)
select
  '99999999-9999-4999-8999-999999999998',
  projects.id,
  'hidden-test',
  'Hidden test',
  'text',
  '{"paragraphs":["hidden"]}'::jsonb,
  99,
  false
from public.projects
where projects.slug = 'iomt-network-attack-scenarios'
on conflict (id) do update set is_visible = false;

set local role anon;

do $$
begin
  if exists (select 1 from public.projects where slug = 'rls-private-project') then
    raise exception 'anon can read a draft project';
  end if;

  if not exists (select 1 from public.projects where slug = 'iomt-network-attack-scenarios') then
    raise exception 'anon cannot read the published IoMT project';
  end if;

  if exists (select 1 from public.project_sections where section_key = 'hidden-test') then
    raise exception 'anon can read a hidden section';
  end if;

  begin
    insert into public.projects (slug, title, year, status)
    values ('anon-write-test', 'Anon write test', 2026, 'published');
    raise exception 'anon unexpectedly inserted a project';
  exception
    when insufficient_privilege then null;
  end;
end
$$;

reset role;
rollback;
