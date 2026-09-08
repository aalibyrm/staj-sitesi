import type { PropsWithChildren } from 'react';
import styles from './CategoryLabel.module.css';

export function CategoryLabel({ children }: PropsWithChildren) {
  return <span className={styles.label}>{children}</span>;
}
