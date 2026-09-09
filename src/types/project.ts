export interface ProjectStudent {
  id: string;
  name: string;
  department: string;
  avatarUrl?: string;
}

export interface ProjectTechnology {
  id: string;
  name: string;
}

export type ProjectMediaType = 'hero' | 'diagram' | 'chart' | 'gallery' | 'thumbnail';

export interface ProjectMedia {
  id: string;
  type: ProjectMediaType;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface TextSectionContent {
  paragraphs: string[];
  items?: string[];
}

export interface ArchitectureSectionContent {
  nodes: Array<{
    id: string;
    label: string;
    subtitle?: string;
    kind?: 'device' | 'wearable' | 'phone' | 'network' | 'server' | 'record' | 'monitor';
  }>;
  connections: Array<{ from: string; to: string; label?: string }>;
}

export interface AttackListSectionContent {
  attacks: Array<{ name: string; description: string; impact?: string }>;
}

export interface MetricsSectionContent {
  metrics: Array<{ name: string; shortName?: string; description: string }>;
}

export interface ChartSectionContent {
  mediaIds?: string[];
  description?: string;
}

export interface StatisticsSectionContent {
  items: Array<{ value: string; label: string }>;
  description?: string;
}

export interface ConclusionSectionContent {
  paragraphs: string[];
}

export interface GallerySectionContent {
  mediaIds?: string[];
}

interface ProjectSectionBase<TType extends string, TContent> {
  id: string;
  key: string;
  title: string;
  type: TType;
  order: number;
  content: TContent;
}

export type ProjectSection =
  | ProjectSectionBase<'text', TextSectionContent>
  | ProjectSectionBase<'architecture', ArchitectureSectionContent>
  | ProjectSectionBase<'attack_list', AttackListSectionContent>
  | ProjectSectionBase<'metrics', MetricsSectionContent>
  | ProjectSectionBase<'chart', ChartSectionContent>
  | ProjectSectionBase<'statistics', StatisticsSectionContent>
  | ProjectSectionBase<'conclusion', ConclusionSectionContent>
  | ProjectSectionBase<'gallery', GallerySectionContent>;

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  category?: string;
  summary?: string;
  coverImageUrl?: string;
  student?: ProjectStudent;
  year: number;
}

export interface ProjectDetail extends Omit<ProjectSummary, 'student'> {
  subtitle?: string;
  department?: string;
  githubUrl?: string;
  students: ProjectStudent[];
  technologies: ProjectTechnology[];
  sections: ProjectSection[];
  media: ProjectMedia[];
}
