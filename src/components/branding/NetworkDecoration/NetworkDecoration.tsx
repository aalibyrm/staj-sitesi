import styles from './NetworkDecoration.module.css';

interface NetworkDecorationProps { side: 'left' | 'right'; }

export function NetworkDecoration({ side }: NetworkDecorationProps) {
  return <div className={[styles.decoration, styles[side]].join(' ')} aria-hidden="true" />;
}
