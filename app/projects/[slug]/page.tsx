import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetailView } from '../../../src/components/project/detail/ProjectDetail';
import { getProjectBySlug, getProjects } from '../../../src/lib/supabase/projectRepository';

interface ProjectPageProps { params: Promise<{ slug: string }>; }

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    return project
      ? { title: project.title + ' | CyberSense Lab', description: project.summary }
      : { title: 'Proje bulunamadı | CyberSense Lab' };
  } catch {
    return { title: 'Proje arşivi | CyberSense Lab' };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, summaries] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const years = Array.from(new Set(summaries.map((summary) => summary.year))).sort((a, b) => b - a);
  return <ProjectDetailView project={project} years={years} />;
}
