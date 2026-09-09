import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { ProjectDetail } from '../../../types/project';
import { BrandLockup } from '../../branding/BrandLockup/BrandLockup';
import { NetworkDecoration } from '../../branding/NetworkDecoration/NetworkDecoration';
import { SiteFooter } from '../../layout/SiteFooter/SiteFooter';
import { Container } from '../../ui/Container/Container';
import { ProjectSectionRenderer } from './ProjectSectionRenderer';
import { ResearchSidebar } from './ResearchSidebar';
import styles from './ProjectDetail.module.css';

interface ProjectDetailViewProps {
  project: ProjectDetail;
  years: number[];
}

export function ProjectDetailView({ project, years }: ProjectDetailViewProps) {
  const articleSections = project.sections.filter(
    (section) => section.key !== 'research_context',
  );

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <NetworkDecoration side="left" />
        <NetworkDecoration side="right" />
        <Container className={styles.heroInner}>
          <BrandLockup />
          <nav className={styles.breadcrumb} aria-label="Sayfa yolu">
            <Link href="/">SARGEM</Link>
            <span aria-hidden="true">/</span>
            <Link href="/">CyberSense Laboratory</Link>
            <span aria-hidden="true">/</span>
            <Link href="/">Staj Projeleri</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Detay</span>
          </nav>
          <h1>{project.title}</h1>
          {project.subtitle ? (
            <p className={styles.subtitle}>{project.subtitle}</p>
          ) : null}
          <div className={styles.metadata} aria-label="Proje üst bilgileri">
            {project.students.length ? (
              <span>
                {project.students.map((student) => student.name).join(', ')}
              </span>
            ) : null}
            {project.department ? (
              <>
                <span className={styles.dot} aria-hidden="true" />{' '}
                <span>{project.department}</span>
              </>
            ) : null}
            <span className={styles.dot} aria-hidden="true" />
            <span>{project.year}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span>CyberSense Lab</span>
            {project.githubUrl ? (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    project.title + ' GitHub reposunu yeni sekmede aç'
                  }
                >
                  GitHub Reposu <ExternalLink size={14} aria-hidden="true" />
                </a>
              </>
            ) : null}
          </div>
        </Container>
      </header>

      <Container className={styles.detailLayout}>
        <article
          className={styles.article}
          aria-label={project.title + ' araştırma içeriği'}
        >
          <ProjectSectionRenderer
            sections={articleSections}
            media={project.media}
          />
        </article>
        <ResearchSidebar project={project} />
      </Container>

      <SiteFooter years={years} selectedYear={project.year} />
    </main>
  );
}
