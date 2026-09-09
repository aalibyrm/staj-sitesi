import Image from 'next/image';
import Link from 'next/link';
import styles from './BrandLockup.module.css';

interface BrandLockupProps {
  variant?: 'hero' | 'footer';
}

export function BrandLockup({ variant = 'hero' }: BrandLockupProps) {
  return (
    <Link
      className={styles[variant]}
      href="/"
      aria-label="CyberSense Lab ana sayfasına dön"
    >
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
    </Link>
  );
}
