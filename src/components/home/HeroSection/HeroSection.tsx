import { BrandLockup } from '../../branding/BrandLockup/BrandLockup';
import { HeroStatement } from '../../branding/HeroStatement/HeroStatement';
import { NetworkDecoration } from '../../branding/NetworkDecoration/NetworkDecoration';
import { ProjectToolbar } from '../../project/ProjectToolbar/ProjectToolbar';
import { Container } from '../../ui/Container/Container';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  searchTerm: string;
  selectedYear: number;
  years: readonly number[];
  onSearchChange: (value: string) => void;
  onYearChange: (year: number) => void;
}

export function HeroSection({ searchTerm, selectedYear, years, onSearchChange, onYearChange }: HeroSectionProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <NetworkDecoration side="left" />
      <NetworkDecoration side="right" />
      <HeroStatement />
      <Container className={styles.inner}>
        <BrandLockup />
        <div className={styles.content}>
          <p className={styles.eyebrow}>Staj Projeleri Arşivi</p>
          <h1 id="hero-title" className={styles.title}>Gerçek Araştırma,<br />Gerçek Deneyim.</h1>
          <p className={styles.description}>CyberSense Lab’de staj yapan öğrencilerin, siber güvenlik, sensör teknolojileri, Tıbbi Nesnelerin İnterneti (MIoT) ve yapay zeka gibi alanlarda geliştirdiği projelerin dijital arşivi.</p>
        </div>
        <ProjectToolbar searchTerm={searchTerm} selectedYear={selectedYear} years={years} onSearchChange={onSearchChange} onYearChange={onYearChange} />
      </Container>
    </section>
  );
}
