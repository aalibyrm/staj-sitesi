'use client';

import Link from 'next/link';
import { BrandLockup } from '../../branding/BrandLockup/BrandLockup';
import { Container } from '../../ui/Container/Container';
import styles from './SiteFooter.module.css';

interface SiteFooterProps { years: readonly number[]; selectedYear: number; onYearChange?: (year: number) => void; }

export function SiteFooter({ years, selectedYear, onYearChange }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandGroup}><BrandLockup variant="footer" /><span className={styles.divider} aria-hidden="true" /><span>SARGEM – Siber Güvenlik Araştırma ve Geliştirme Merkezi</span></div>
        <p className={styles.quote}>“Veriden güvene, araştırmadan etkiye.”</p>
        <nav className={styles.years} aria-label="Arşiv yılları">
          {years.map((year) => onYearChange ? <button key={year} type="button" className={year === selectedYear ? styles.activeYear : styles.year} onClick={() => onYearChange(year)} aria-current={year === selectedYear ? 'page' : undefined}>{year}</button> : <Link key={year} className={year === selectedYear ? styles.activeYear : styles.year} href="/" aria-current={year === selectedYear ? 'page' : undefined}>{year}</Link>)}
          <span className={styles.accentLine} aria-hidden="true" />
        </nav>
      </Container>
    </footer>
  );
}
