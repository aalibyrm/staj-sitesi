import { Search } from 'lucide-react';
import styles from './SearchField.module.css';

interface SearchFieldProps { value: string; onChange: (value: string) => void; }

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.srOnly}>Projelerde ara</span>
      <Search size={19} strokeWidth={1.8} aria-hidden="true" />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Proje adı, teknoloji veya anahtar kelime ile ara..." aria-label="Projelerde ara" />
    </label>
  );
}
