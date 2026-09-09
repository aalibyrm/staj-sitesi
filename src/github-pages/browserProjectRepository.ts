import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ProjectDetail, ProjectSummary } from '../types/project';
import {
  mapProjectDetail,
  mapProjectSummary,
  type ProjectDetailRow,
  type ProjectSummaryRow,
} from '../lib/supabase/projectMapper';

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

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('GitHub Pages için Supabase bağlantısı yapılandırılmamış.');
  }

  client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  return client;
}

export async function getBrowserProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await getClient()
    .from('projects')
    .select(summarySelect)
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) throw error;
  const projectMediaBaseUrl = import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-media`
    : undefined;

  return ((data ?? []) as unknown as ProjectSummaryRow[]).map((row) =>
    mapProjectSummary(row, projectMediaBaseUrl),
  );
}

export async function getBrowserProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const { data, error } = await getClient()
    .from('projects')
    .select(detailSelect)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data ? mapProjectDetail(data as unknown as ProjectDetailRow) : null;
}
