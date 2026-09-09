import 'server-only';
import { cache } from 'react';
import type { ProjectDetail, ProjectSummary } from '../../types/project';
import { getSupabaseClient } from './client';
import {
  mapProjectDetail,
  mapProjectSummary,
  type ProjectDetailRow,
  type ProjectSummaryRow,
} from './projectMapper';

const summarySelect = [
  'id', 'slug', 'title', 'summary', 'category', 'year', 'cover_image_url',
  'project_students (display_order, students (id, name, department, avatar_url))',
  'project_media (id, type, url, alt_text, caption, display_order)',
].join(',');

const detailSelect = [
  'id', 'slug', 'title', 'subtitle', 'summary', 'category', 'year', 'department',
  'cover_image_url', 'github_url', 'repository_url',
  'project_students (display_order, students (id, name, department, avatar_url))',
  'project_technologies (display_order, technologies (id, name))',
  'project_sections (id, section_key, title, section_type, content, display_order, is_visible)',
  'project_media (id, type, url, alt_text, caption, display_order)',
].join(',');

export class ProjectRepositoryError extends Error {
  constructor(operation: string, cause?: unknown) {
    super('Proje arşivi ' + operation + ' sırasında yüklenemedi.', { cause });
    this.name = 'ProjectRepositoryError';
  }
}

async function fetchProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(summarySelect)
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) throw new ProjectRepositoryError('listelenmesi', error);
  const projectMediaBaseUrl = process.env.SUPABASE_URL
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/project-media`
    : undefined;

  return ((data ?? []) as unknown as ProjectSummaryRow[]).map((row) =>
    mapProjectSummary(row, projectMediaBaseUrl),
  );
}

async function fetchProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select(detailSelect)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw new ProjectRepositoryError('açılması', error);
  return data ? mapProjectDetail(data as unknown as ProjectDetailRow) : null;
}

export const getProjects = cache(fetchProjects);
export const getProjectBySlug = cache(fetchProjectBySlug);
