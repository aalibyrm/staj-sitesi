import type {
  ArchitectureSectionContent,
  AttackListSectionContent,
  ChartSectionContent,
  ConclusionSectionContent,
  GallerySectionContent,
  MetricsSectionContent,
  ProjectDetail,
  ProjectMedia,
  ProjectMediaType,
  ProjectSection,
  ProjectStudent,
  ProjectSummary,
  StatisticsSectionContent,
  TextSectionContent,
} from '../../types/project';

interface StudentRow { id: string; name: string; department: string; avatar_url: string | null }
interface TechnologyRow { id: string; name: string }
interface MediaRow { id: string; type: string; url: string; alt_text: string | null; caption: string | null; display_order: number | null }
interface SectionRow { id: string; section_key: string; title: string; section_type: string; content: unknown; display_order: number | null; is_visible: boolean }
interface StudentRelationRow { display_order: number | null; students: StudentRow | StudentRow[] | null }
interface TechnologyRelationRow { display_order: number | null; technologies: TechnologyRow | TechnologyRow[] | null }

const CARD_COVER_VERSION = '20260909-8x3';

export interface ProjectSummaryRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  year: number;
  cover_image_url: string | null;
  project_students: StudentRelationRow[] | null;
  project_media: MediaRow[] | null;
}

export interface ProjectDetailRow extends ProjectSummaryRow {
  subtitle: string | null;
  department: string | null;
  github_url: string | null;
  repository_url: string | null;
  project_technologies: TechnologyRelationRow[] | null;
  project_sections: SectionRow[] | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function stringArray(value: unknown): string[] | null {
  return Array.isArray(value) && value.every(isString) ? value : null;
}

function singleRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function optionalString(value: unknown): string | undefined {
  return isString(value) ? value : undefined;
}

function parseText(content: unknown): TextSectionContent | null {
  if (!isRecord(content)) return null;
  const paragraphs = stringArray(content.paragraphs) ?? [];
  const items = content.items === undefined ? undefined : stringArray(content.items) ?? undefined;
  return paragraphs.length || items?.length ? { paragraphs, items } : null;
}

function parseArchitecture(content: unknown): ArchitectureSectionContent | null {
  if (!isRecord(content) || !Array.isArray(content.nodes) || !Array.isArray(content.connections)) return null;
  const nodes = content.nodes.flatMap((node) => {
    if (!isRecord(node) || !isString(node.id) || !isString(node.label)) return [];
    const allowedKinds = ['device', 'wearable', 'phone', 'network', 'server', 'record', 'monitor'] as const;
    const kind = allowedKinds.find((item) => item === node.kind);
    return [{ id: node.id, label: node.label, subtitle: optionalString(node.subtitle), kind }];
  });
  const connections = content.connections.flatMap((connection) => {
    if (!isRecord(connection) || !isString(connection.from) || !isString(connection.to)) return [];
    return [{ from: connection.from, to: connection.to, label: optionalString(connection.label) }];
  });
  return nodes.length ? { nodes, connections } : null;
}

function parseAttacks(content: unknown): AttackListSectionContent | null {
  if (!isRecord(content) || !Array.isArray(content.attacks)) return null;
  const attacks = content.attacks.flatMap((attack) => {
    if (!isRecord(attack) || !isString(attack.name) || !isString(attack.description)) return [];
    return [{ name: attack.name, description: attack.description, impact: optionalString(attack.impact) }];
  });
  return attacks.length ? { attacks } : null;
}

function parseMetrics(content: unknown): MetricsSectionContent | null {
  if (!isRecord(content) || !Array.isArray(content.metrics)) return null;
  const metrics = content.metrics.flatMap((metric) => {
    if (!isRecord(metric) || !isString(metric.name) || !isString(metric.description)) return [];
    return [{ name: metric.name, shortName: optionalString(metric.shortName), description: metric.description }];
  });
  return metrics.length ? { metrics } : null;
}

function parseChart(content: unknown): ChartSectionContent | null {
  if (!isRecord(content)) return null;
  const mediaIds = content.mediaIds === undefined ? undefined : stringArray(content.mediaIds) ?? undefined;
  const description = optionalString(content.description);
  return mediaIds?.length || description ? { mediaIds, description } : null;
}

function parseStatistics(content: unknown): StatisticsSectionContent | null {
  if (!isRecord(content) || !Array.isArray(content.items)) return null;
  const items = content.items.flatMap((item) => {
    if (!isRecord(item) || !isString(item.value) || !isString(item.label)) return [];
    return [{ value: item.value, label: item.label }];
  });
  return items.length ? { items, description: optionalString(content.description) } : null;
}

function parseConclusion(content: unknown): ConclusionSectionContent | null {
  if (!isRecord(content)) return null;
  const paragraphs = stringArray(content.paragraphs);
  return paragraphs?.length ? { paragraphs } : null;
}

function parseGallery(content: unknown): GallerySectionContent | null {
  if (!isRecord(content)) return null;
  const mediaIds = content.mediaIds === undefined ? undefined : stringArray(content.mediaIds) ?? undefined;
  return mediaIds?.length ? { mediaIds } : null;
}

function parseSection(row: SectionRow): ProjectSection | null {
  const base = { id: row.id, key: row.section_key, title: row.title, order: row.display_order ?? 0 };
  switch (row.section_type) {
    case 'text': { const content = parseText(row.content); return content ? { ...base, type: 'text', content } : null; }
    case 'architecture': { const content = parseArchitecture(row.content); return content ? { ...base, type: 'architecture', content } : null; }
    case 'attack_list': { const content = parseAttacks(row.content); return content ? { ...base, type: 'attack_list', content } : null; }
    case 'metrics': { const content = parseMetrics(row.content); return content ? { ...base, type: 'metrics', content } : null; }
    case 'chart': { const content = parseChart(row.content); return content ? { ...base, type: 'chart', content } : null; }
    case 'statistics': { const content = parseStatistics(row.content); return content ? { ...base, type: 'statistics', content } : null; }
    case 'conclusion': { const content = parseConclusion(row.content); return content ? { ...base, type: 'conclusion', content } : null; }
    case 'gallery': { const content = parseGallery(row.content); return content ? { ...base, type: 'gallery', content } : null; }
    default: return null;
  }
}

function mapStudents(rows: StudentRelationRow[] | null): ProjectStudent[] {
  return [...(rows ?? [])]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((relation) => {
      const row = singleRelation(relation.students);
      return row ? [{ id: row.id, name: row.name, department: row.department, avatarUrl: row.avatar_url ?? undefined }] : [];
    });
}

function isMediaType(value: string): value is ProjectMediaType {
  return ['hero', 'diagram', 'chart', 'gallery', 'thumbnail'].includes(value);
}

function mapMedia(rows: MediaRow[] | null): ProjectMedia[] {
  return [...(rows ?? [])]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((row) => isMediaType(row.type) && isString(row.url)
      ? [{ id: row.id, type: row.type, url: row.url, alt: row.alt_text ?? '', caption: row.caption ?? undefined, order: row.display_order ?? 0 }]
      : []);
}

function resolveCover(cover: string | null, media: ProjectMedia[]): string | undefined {
  return cover ?? media.find((item) => item.type === 'hero')?.url;
}

function resolveCardCover(
  row: ProjectSummaryRow,
  media: ProjectMedia[],
  projectMediaBaseUrl?: string,
): string | undefined {
  const storedCover = resolveCover(row.cover_image_url, media);
  const cover = storedCover ?? (projectMediaBaseUrl
    ? `${projectMediaBaseUrl.replace(/\/$/, '')}/${encodeURIComponent(row.slug)}/cover.png`
    : undefined);

  if (!cover || !cover.includes('/storage/v1/object/public/project-media/')) return cover;

  const separator = cover.includes('?') ? '&' : '?';
  return `${cover}${separator}v=${CARD_COVER_VERSION}`;
}

export function mapProjectSummary(
  row: ProjectSummaryRow,
  projectMediaBaseUrl?: string,
): ProjectSummary {
  const students = mapStudents(row.project_students);
  const media = mapMedia(row.project_media);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category ?? undefined,
    summary: row.summary ?? undefined,
    coverImageUrl: resolveCardCover(row, media, projectMediaBaseUrl),
    student: students[0],
    year: row.year,
  };
}

export function mapProjectDetail(row: ProjectDetailRow): ProjectDetail {
  const students = mapStudents(row.project_students);
  const media = mapMedia(row.project_media);
  const technologies = [...(row.project_technologies ?? [])]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((relation) => {
      const technology = singleRelation(relation.technologies);
      return technology ? [{ id: technology.id, name: technology.name }] : [];
    });
  const sections = [...(row.project_sections ?? [])]
    .filter((section) => section.is_visible)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((section) => parseSection(section) ?? []);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    summary: row.summary ?? undefined,
    category: row.category ?? undefined,
    year: row.year,
    department: row.department ?? students[0]?.department,
    coverImageUrl: resolveCover(row.cover_image_url, media),
    githubUrl: row.github_url ?? row.repository_url ?? undefined,
    students,
    technologies,
    sections,
    media,
  };
}
