import type { Project } from '../../../types/project';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import styles from './ProjectGrid.module.css';

interface ProjectGridProps { projects: Project[]; }

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return <div className={styles.empty} role="status"><h2>Bu ölçütlere uygun proje bulunamadı.</h2><p>Arama ifadenizi veya seçtiğiniz yılı değiştirmeyi deneyin.</p></div>;
  }
  return <section className={styles.grid} aria-label="Staj projeleri">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</section>;
}
