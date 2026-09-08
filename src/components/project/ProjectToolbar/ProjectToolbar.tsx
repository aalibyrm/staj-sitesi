import { SearchField } from '../SearchField/SearchField';
import { YearSelect } from '../YearSelect/YearSelect';
import styles from './ProjectToolbar.module.css';

interface ProjectToolbarProps {
  searchTerm: string;
  selectedYear: number;
  years: readonly number[];
  onSearchChange: (value: string) => void;
  onYearChange: (year: number) => void;
}

export function ProjectToolbar({ searchTerm, selectedYear, years, onSearchChange, onYearChange }: ProjectToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <SearchField value={searchTerm} onChange={onSearchChange} />
      <YearSelect value={selectedYear} years={years} onChange={onYearChange} />
    </div>
  );
}
