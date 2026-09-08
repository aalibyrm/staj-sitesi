import { CalendarDays, ChevronDown } from 'lucide-react';
import styles from './YearSelect.module.css';

interface YearSelectProps { value: number; years: readonly number[]; onChange: (year: number) => void; }

export function YearSelect({ value, years, onChange }: YearSelectProps) {
  return (
    <label className={styles.field}>
      <span className={styles.srOnly}>Proje yılı</span>
      <CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" />
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label="Proje yılı">
        {years.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
      <ChevronDown className={styles.chevron} size={17} strokeWidth={1.8} aria-hidden="true" />
    </label>
  );
}
