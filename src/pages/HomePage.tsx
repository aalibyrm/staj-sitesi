'use client';

import { useMemo, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection/HeroSection';
import { SiteFooter } from '../components/layout/SiteFooter/SiteFooter';
import { ProjectGrid } from '../components/project/ProjectGrid/ProjectGrid';
import { Container } from '../components/ui/Container/Container';
import { archiveYears, projects } from '../data/projects';
import styles from './HomePage.module.css';

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('tr-TR');
    return projects.filter((project) => {
      if (project.year !== selectedYear) return false;
      if (!term) return true;
      return [project.title, project.category, project.description, project.student.name, project.student.department].join(' ').toLocaleLowerCase('tr-TR').includes(term);
    });
  }, [searchTerm, selectedYear]);

  return (
    <main className={styles.page}>
      <HeroSection searchTerm={searchTerm} selectedYear={selectedYear} years={archiveYears} onSearchChange={setSearchTerm} onYearChange={setSelectedYear} />
      <Container><ProjectGrid projects={filteredProjects} /></Container>
      <SiteFooter years={archiveYears} selectedYear={selectedYear} onYearChange={setSelectedYear} />
    </main>
  );
}
