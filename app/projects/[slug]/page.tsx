import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { BrandLockup } from '../../../src/components/branding/BrandLockup/BrandLockup';
import { NetworkDecoration } from '../../../src/components/branding/NetworkDecoration/NetworkDecoration';
import { SiteFooter } from '../../../src/components/layout/SiteFooter/SiteFooter';
import { StudentMeta } from '../../../src/components/project/StudentMeta/StudentMeta';
import { CategoryLabel } from '../../../src/components/ui/CategoryLabel/CategoryLabel';
import { Container } from '../../../src/components/ui/Container/Container';
import { archiveYears, getProjectBySlug, projects } from '../../../src/data/projects';
import styles from './page.module.css';

interface ProjectPageProps { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return project ? { title: project.title + ' | CyberSense Lab', description: project.description } : { title: 'Proje bulunamadı | CyberSense Lab' };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <NetworkDecoration side="left" />
        <NetworkDecoration side="right" />
        <Container className={styles.inner}>
          <Link className={styles.back} href="/"><ArrowLeft size={17} aria-hidden="true" />Proje arşivine dön</Link>
          <BrandLockup />
          <div className={styles.content}>
            <CategoryLabel>{project.category}</CategoryLabel>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className={styles.metaRow}><StudentMeta student={project.student} /><span className={styles.year}>{project.year}</span></div>
          </div>
          <div className={styles.notice}>
            <span className={styles.noticeLine} aria-hidden="true" />
            <h2>Proje detayları yakında eklenecek.</h2>
            <p>Araştırma süreci ve proje çıktıları tamamlandığında bu sayfada yayınlanacak.</p>
          </div>
        </Container>
      </section>
      <SiteFooter years={archiveYears} selectedYear={project.year} />
    </main>
  );
}
