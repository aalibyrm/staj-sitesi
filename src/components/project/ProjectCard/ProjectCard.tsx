import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../../../types/project';
import { CategoryLabel } from '../../ui/CategoryLabel/CategoryLabel';
import { StudentMeta } from '../StudentMeta/StudentMeta';
import styles from './ProjectCard.module.css';

interface ProjectCardProps { project: Project; }

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={'/projects/' + project.slug} aria-label={project.title + ' projesini görüntüle'}>
        <div className={styles.cover}><img src={project.image} alt={project.title + ' için geçici proje görseli'} /></div>
        <div className={styles.body}>
          <CategoryLabel>{project.category}</CategoryLabel>
          <h2 className={styles.title}>{project.title}</h2>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.footer}><StudentMeta student={project.student} /><ArrowRight className={styles.arrow} size={21} strokeWidth={1.65} aria-hidden="true" /></div>
        </div>
      </Link>
    </article>
  );
}
