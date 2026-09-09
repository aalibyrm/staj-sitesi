import { useEffect, useState } from 'react';
import NotFound from '../../app/not-found';
import { ArchiveHome } from '../components/home/ArchiveHome/ArchiveHome';
import { ErrorState } from '../components/layout/ErrorState/ErrorState';
import { ProjectDetailView } from '../components/project/detail/ProjectDetail';
import type { ProjectDetail, ProjectSummary } from '../types/project';
import {
  getBrowserProjectBySlug,
  getBrowserProjects,
} from './browserProjectRepository';
import styles from './GitHubPagesApp.module.css';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'home'; projects: ProjectSummary[] }
  | { kind: 'project'; project: ProjectDetail; years: number[] }
  | { kind: 'not-found' }
  | { kind: 'error' };

function getProjectSlug(): string | null {
  const match = window.location.hash.match(/^#\/projects\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function GitHubPagesApp() {
  const [routeVersion, setRouteVersion] = useState(0);
  const [retryVersion, setRetryVersion] = useState(0);
  const [view, setView] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    const handleHashChange = () => {
      setView({ kind: 'loading' });
      setRouteVersion((version) => version + 1);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let active = true;
    const slug = getProjectSlug();

    async function load() {
      try {
        if (!slug) {
          const projects = await getBrowserProjects();
          if (active) {
            document.title = 'CyberSense Lab | Staj Projeleri Arşivi';
            setView({ kind: 'home', projects });
          }
          return;
        }

        const [project, summaries] = await Promise.all([
          getBrowserProjectBySlug(slug),
          getBrowserProjects(),
        ]);
        if (!active) return;
        if (!project) {
          document.title = 'Proje bulunamadı | CyberSense Lab';
          setView({ kind: 'not-found' });
          return;
        }

        const years = Array.from(new Set(summaries.map((item) => item.year))).sort(
          (a, b) => b - a,
        );
        document.title = project.title + ' | CyberSense Lab';
        setView({ kind: 'project', project, years });
      } catch {
        if (active) setView({ kind: 'error' });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [routeVersion, retryVersion]);

  if (view.kind === 'loading') {
    return (
      <main className={styles.statusPage}>
        <output className={styles.status} aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Proje arşivi yükleniyor…</p>
        </output>
      </main>
    );
  }

  if (view.kind === 'error') {
    return (
      <ErrorState
        onRetry={() => {
          setView({ kind: 'loading' });
          setRetryVersion((version) => version + 1);
        }}
      />
    );
  }

  if (view.kind === 'not-found') return <NotFound />;
  if (view.kind === 'home') return <ArchiveHome projects={view.projects} />;
  return <ProjectDetailView project={view.project} years={view.years} />;
}
