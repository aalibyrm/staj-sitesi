import Image from 'next/image';
import {
  Activity,
  Database,
  HeartPulse,
  MonitorDot,
  Network,
  Server,
  Smartphone,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type {
  ArchitectureSectionContent,
  ProjectMedia,
  ProjectSection,
} from '../../../types/project';
import styles from './ProjectSectionRenderer.module.css';

interface ProjectSectionRendererProps {
  sections: ProjectSection[];
  media: ProjectMedia[];
}

function SectionShell({
  section,
  children,
  className = '',
}: {
  section: ProjectSection;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = 'section-' + section.id;
  return (
    <section
      className={[styles.section, className].filter(Boolean).join(' ')}
      aria-labelledby={headingId}
    >
      <header className={styles.sectionHeader}>
        <span className={styles.eyebrow}>
          {String(section.order).padStart(2, '0')}
        </span>
        <h2 id={headingId}>{section.title}</h2>
      </header>
      {children}
    </section>
  );
}

const architectureIcons: Record<
  NonNullable<ArchitectureSectionContent['nodes'][number]['kind']>,
  LucideIcon
> = {
  device: HeartPulse,
  wearable: Activity,
  phone: Smartphone,
  network: Wifi,
  server: Server,
  record: Database,
  monitor: MonitorDot,
};

function Architecture({
  section,
}: {
  section: Extract<ProjectSection, { type: 'architecture' }>;
}) {
  return (
    <SectionShell section={section}>
      <div className={styles.architecture}>
        <div className={styles.nodeFlow}>
          {section.content.nodes.map((node) => {
            const Icon = node.kind ? architectureIcons[node.kind] : Network;
            return (
              <div className={styles.node} key={node.id}>
                <Icon size={27} strokeWidth={1.55} aria-hidden="true" />
                <strong>{node.label}</strong>
                {node.subtitle ? <span>{node.subtitle}</span> : null}
              </div>
            );
          })}
        </div>
        {section.content.connections.length ? (
          <ul className={styles.connectionList} aria-label="Ağ bağlantıları">
            {section.content.connections.map((connection) => {
              const from =
                section.content.nodes.find(
                  (node) => node.id === connection.from,
                )?.label ?? connection.from;
              const to =
                section.content.nodes.find((node) => node.id === connection.to)
                  ?.label ?? connection.to;
              return (
                <li key={connection.from + '-' + connection.to}>
                  <span>{from}</span>
                  <span className={styles.connectionLine} aria-hidden="true" />
                  {connection.label ? <em>{connection.label}</em> : null}
                  <span className={styles.connectionLine} aria-hidden="true" />
                  <span>{to}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </SectionShell>
  );
}

function ResearchFigures({
  section,
  media,
  gallery = false,
}: {
  section: Extract<ProjectSection, { type: 'chart' | 'gallery' }>;
  media: ProjectMedia[];
  gallery?: boolean;
}) {
  const ids = section.content.mediaIds;
  const expectedType = gallery ? 'gallery' : 'chart';
  const figures = media.filter((item) =>
    ids?.length ? ids.includes(item.id) : item.type === expectedType,
  );
  if (!figures.length) return null;

  return (
    <SectionShell section={section}>
      {'description' in section.content && section.content.description ? (
        <p className={styles.sectionIntro}>{section.content.description}</p>
      ) : null}
      <div className={styles.figures}>
        {figures.map((figure) => (
          <figure key={figure.id} className={styles.figure}>
            <Image
              src={figure.url}
              alt={figure.alt}
              width={1200}
              height={675}
              sizes="(max-width: 1099px) 100vw, 42vw"
              unoptimized
            />
            {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}

function renderSection(section: ProjectSection, media: ProjectMedia[]) {
  switch (section.type) {
    case 'text':
      return (
        <SectionShell section={section}>
          <div className={styles.prose}>
            {section.content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.content.items?.length ? (
              <ul className={styles.proseList}>
                {section.content.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </SectionShell>
      );
    case 'architecture':
      return <Architecture section={section} />;
    case 'attack_list':
      return (
        <SectionShell section={section}>
          <ol className={styles.attackList}>
            {section.content.attacks.map((attack, index) => (
              <li key={attack.name}>
                <span className={styles.attackNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{attack.name}</h3>
                  <p>{attack.description}</p>
                  {attack.impact ? <small>{attack.impact}</small> : null}
                </div>
              </li>
            ))}
          </ol>
        </SectionShell>
      );
    case 'metrics':
      return (
        <SectionShell section={section}>
          <div className={styles.metrics}>
            {section.content.metrics.map((metric) => (
              <div key={metric.name}>
                <h3>
                  {metric.name}
                  {metric.shortName ? <span> ({metric.shortName})</span> : null}
                </h3>
                <p>{metric.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      );
    case 'chart':
      return <ResearchFigures section={section} media={media} />;
    case 'statistics':
      return (
        <SectionShell section={section}>
          <div className={styles.statistics}>
            {section.content.items.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {section.content.description ? (
            <p className={styles.statisticsNote}>
              {section.content.description}
            </p>
          ) : null}
        </SectionShell>
      );
    case 'conclusion':
      return (
        <SectionShell section={section} className={styles.conclusion}>
          <div className={styles.prose}>
            {section.content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </SectionShell>
      );
    case 'gallery':
      return <ResearchFigures section={section} media={media} gallery />;
  }
}

export function ProjectSectionRenderer({
  sections,
  media,
}: ProjectSectionRendererProps) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.id}>{renderSection(section, media)}</div>
      ))}
    </>
  );
}
