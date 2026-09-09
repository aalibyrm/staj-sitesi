'use client';

import { useMemo, useState } from 'react';
import type { ProjectSummary } from '../../../types/project';
import { HeroSection } from '../HeroSection/HeroSection';
import { SiteFooter } from '../../layout/SiteFooter/SiteFooter';
import { ProjectGrid } from '../../project/ProjectGrid/ProjectGrid';
import { Container } from '../../ui/Container/Container';
import styles from './ArchiveHome.module.css';

interface ArchiveHomeProps {
  projects: ProjectSummary[];
}

export function ArchiveHome({ projects }: ArchiveHomeProps) {
  const years = useMemo(
    () => Array.from(new Set(projects.map((project) => project.year))).sort((a, b) => b - a),
    [projects],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(years[0] ?? 0);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('tr-TR');
    return projects.filter((project) => {
      if (project.year !== selectedYear) return false;
      if (!term) return true;
      return [
        project.title,
        project.category,
        project.summary,
        project.student?.name,
        project.student?.department,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR')
        .includes(term);
    });
  }, [projects, searchTerm, selectedYear]);

  return (
    <main className={styles.page}>
      <HeroSection
        searchTerm={searchTerm}
        selectedYear={selectedYear}
        years={years}
        onSearchChange={setSearchTerm}
        onYearChange={setSelectedYear}
      />
      <Container>
        <ProjectGrid projects={filteredProjects} />
      </Container>
      <SiteFooter years={years} selectedYear={selectedYear || undefined} onYearChange={setSelectedYear} />
    </main>
  );
}
