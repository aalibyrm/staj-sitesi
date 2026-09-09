import { BrandLockup } from '../../../src/components/branding/BrandLockup/BrandLockup';
import { Container } from '../../../src/components/ui/Container/Container';
import styles from './loading.module.css';

export default function ProjectLoading() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Proje yükleniyor">
      <Container className={styles.hero}>
        <BrandLockup />
        <span className={styles.breadcrumb} />
        <span className={styles.title} />
        <span className={styles.subtitle} />
        <span className={styles.metadata} />
      </Container>
      <Container className={styles.layout}>
        <article>
          <span className={styles.heading} />
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.block} />
        </article>
        <aside>
          <span className={styles.heading} />
          <span className={styles.sideLine} />
          <span className={styles.sideLine} />
          <span className={styles.sideLine} />
        </aside>
      </Container>
    </main>
  );
}
