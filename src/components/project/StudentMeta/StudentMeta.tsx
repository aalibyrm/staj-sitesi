import type { Student } from '../../../types/project';
import { Avatar } from '../../ui/Avatar/Avatar';
import styles from './StudentMeta.module.css';

interface StudentMetaProps { student: Student; }

export function StudentMeta({ student }: StudentMetaProps) {
  return (
    <div className={styles.meta}>
      <Avatar name={student.name} src={student.avatar} />
      <span className={styles.info}>
        <span className={styles.name}>{student.name}</span>
        <span className={styles.department}>{student.department}</span>
      </span>
    </div>
  );
}
