'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { BrandLockup } from '../../branding/BrandLockup/BrandLockup';
import { Container } from '../../ui/Container/Container';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <main className={styles.page}>
      <Container className={styles.inner}>
        <BrandLockup />
        <span className={styles.accent} aria-hidden="true" />
        <h1>Proje arşivi yüklenemedi.</h1>
        <p>Bağlantıda geçici bir sorun oluştu. Biraz sonra yeniden deneyebilirsiniz.</p>
        <div className={styles.actions}>
          <button type="button" onClick={onRetry}><RefreshCw size={17} aria-hidden="true" />Yeniden dene</button>
          <Link href="/">Staj projelerine dön</Link>
        </div>
      </Container>
    </main>
  );
}
