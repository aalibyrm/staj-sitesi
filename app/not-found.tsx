import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandLockup } from '../src/components/branding/BrandLockup/BrandLockup';
import { Container } from '../src/components/ui/Container/Container';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <Container className={styles.inner}>
        <BrandLockup />
        <p className={styles.code}>404</p>
        <h1>Proje bulunamadı.</h1>
        <p>Aradığınız proje kaldırılmış veya bağlantısı değişmiş olabilir.</p>
        <Link href="/" className={styles.back}><ArrowLeft size={17} aria-hidden="true" />Proje arşivine dön</Link>
      </Container>
    </main>
  );
}
