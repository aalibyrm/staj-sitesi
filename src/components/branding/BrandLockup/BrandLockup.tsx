import { Network } from 'lucide-react';
import styles from './BrandLockup.module.css';

interface BrandLockupProps { variant?: 'hero' | 'footer'; }

export function BrandLockup({ variant = 'hero' }: BrandLockupProps) {
  return (
    <div className={styles[variant]}>
      <span className={styles.mark} aria-hidden="true"><Network size={variant === 'hero' ? 34 : 20} strokeWidth={1.8} /></span>
      <span className={styles.copy}>
        <span className={styles.name}>CyberSense <strong>Lab</strong></span>
        {variant === 'hero' ? <span className={styles.subtitle}>SARGEM<br />Siber Güvenlik Araştırma<br />ve Geliştirme Merkezi</span> : null}
      </span>
    </div>
  );
}
