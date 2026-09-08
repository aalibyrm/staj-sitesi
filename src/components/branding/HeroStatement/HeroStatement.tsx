import styles from './HeroStatement.module.css';

export function HeroStatement() {
  return (
    <aside className={styles.statement} aria-label="CyberSense Lab vizyonu">
      <p>Daha güvenli<br />Daha akıllı<br />Daha yaşanabilir<br />yarınlar</p>
      <span className={styles.line} aria-hidden="true" />
      <span className={styles.brand}>CyberSense Lab</span>
    </aside>
  );
}
