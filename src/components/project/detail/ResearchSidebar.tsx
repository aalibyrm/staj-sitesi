import type { ProjectDetail } from '../../../types/project';
import styles from './ResearchSidebar.module.css';

interface ResearchSidebarProps {
  project: ProjectDetail;
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.block}>
      <h2>{title}</h2>
      <span className={styles.accent} aria-hidden="true" />
      {children}
    </section>
  );
}

export function ResearchSidebar({ project }: ResearchSidebarProps) {
  const contextSection = project.sections.find(
    (section) => section.key === 'research_context' && section.type === 'text',
  );
  const contextItems = contextSection?.type === 'text' ? contextSection.content.items ?? [] : [];

  return (
    <aside className={styles.sidebar} aria-label="Proje araştırma bilgileri">
      <SidebarSection title="Proje Bilgileri">
        <dl className={styles.infoList}>
          {project.students.length ? (
            <div><dt>Öğrenci</dt><dd>{project.students.map((student) => student.name).join(', ')}</dd></div>
          ) : null}
          {project.department ? <div><dt>Bölüm</dt><dd>{project.department}</dd></div> : null}
          <div><dt>Yıl</dt><dd>{project.year}</dd></div>
          <div><dt>Laboratuvar</dt><dd>CyberSense Lab</dd></div>
          {project.category ? <div><dt>Odak</dt><dd>{project.category}</dd></div> : null}
        </dl>
      </SidebarSection>

      {project.technologies.length ? (
        <SidebarSection title="Teknik Yığın">
          <ul className={styles.textList}>
            {project.technologies.map((technology) => <li key={technology.id}>{technology.name}</li>)}
          </ul>
        </SidebarSection>
      ) : null}

      {contextItems.length ? (
        <SidebarSection title={contextSection?.title ?? 'Araştırma Bağlamı'}>
          <ul className={styles.textList}>
            {contextItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </SidebarSection>
      ) : null}
    </aside>
  );
}
