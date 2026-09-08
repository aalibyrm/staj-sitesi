import type { PropsWithChildren } from 'react';
import styles from './Container.module.css';

interface ContainerProps extends PropsWithChildren { className?: string; }

export function Container({ children, className = '' }: ContainerProps) {
  return <div className={[styles.container, className].filter(Boolean).join(' ')}>{children}</div>;
}
