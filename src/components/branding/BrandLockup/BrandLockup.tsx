import Image from 'next/image';
import styles from './BrandLockup.module.css';

interface BrandLockupProps {
  variant?: 'hero' | 'footer';
}

export function BrandLockup({ variant = 'hero' }: BrandLockupProps) {
  return (
    <div className={styles[variant]}>
      <span className={styles.mark} aria-hidden="true">
        <Image
          src="/branding/cybersense-shield.png"
          alt=""
          width={1254}
          height={1254}
          sizes={variant === 'hero' ? '82px' : '34px'}
          priority={variant === 'hero'}
        />
      </span>
      <span className={styles.copy}>
        <span className={styles.name}>
          CyberSense <strong>Lab</strong>
        </span>
        {variant === 'hero' ? (
          <span className={styles.subtitle}>
            SARGEM
            <br />
            Siber Güvenlik Araştırma
            <br />
            ve Geliştirme Merkezi
          </span>
        ) : null}
      </span>
    </div>
  );
}
