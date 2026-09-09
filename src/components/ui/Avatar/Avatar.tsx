import Image from 'next/image';
import styles from './Avatar.module.css';

interface AvatarProps { name: string; src?: string; }

export function Avatar({ name, src }: AvatarProps) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  if (src) return <Image className={styles.avatar} src={src} alt={name + ' profil fotoğrafı'} width={36} height={36} unoptimized />;
  return <span className={styles.avatarFallback} aria-hidden="true">{initials}</span>;
}
