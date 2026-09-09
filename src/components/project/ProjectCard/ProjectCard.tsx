import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProjectSummary } from '../../../types/project';
import { CategoryLabel } from '../../ui/CategoryLabel/CategoryLabel';
import { StudentMeta } from '../StudentMeta/StudentMeta';
import styles from './ProjectCard.module.css';

interface ProjectCardProps { project: ProjectSummary; }

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={'/projects/' + project.slug} aria-label={project.title + ' projesini görüntüle'}>
        {project.coverImageUrl ? (
          <div className={styles.cover}>
            <Image src={project.coverImageUrl} alt={project.title + ' proje görseli'} fill sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw" unoptimized />
          </div>
        ) : null}
        <div className={styles.body}>
          {project.category ? <CategoryLabel>{project.category}</CategoryLabel> : null}
          <h2 className={styles.title}>{project.title}</h2>
          {project.summary ? <p className={styles.description}>{project.summary}</p> : null}
          <div className={styles.footer}>
            {project.student ? <StudentMeta student={project.student} /> : <span />}
            <ArrowRight className={styles.arrow} size={21} strokeWidth={1.65} aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}
