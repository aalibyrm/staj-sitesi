import { ArchiveHome } from '../src/components/home/ArchiveHome/ArchiveHome';
import { getProjects } from '../src/lib/supabase/projectRepository';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();
  return <ArchiveHome projects={projects} />;
}
