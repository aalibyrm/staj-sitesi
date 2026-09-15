import {
  BrainCircuit,
  HeartPulse,
  MapPin,
  Network,
  RadioTower,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '../../ui/Container/Container';
import styles from './ResearchAreas.module.css';

interface ResearchArea {
  title: string;
  description: string;
  icon: LucideIcon;
}

const researchAreas: ResearchArea[] = [
  {
    title: 'Differential Learning',
    description: 'Gizliliği koruyan makine öğrenmesi yöntemleri ve dağıtık öğrenme.',
    icon: BrainCircuit,
  },
  {
    title: 'Tıbbi Nesnelerin İnterneti (Medical IoT / MIoT)',
    description: 'Sağlık için akıllı sensör sistemleri ve veri analitiği.',
    icon: HeartPulse,
  },
  {
    title: 'Siber Güvenlik ve Ağ Güvenliği',
    description: 'Güvenli sistemler, ağ analizi ve tehdit tespiti.',
    icon: Shield,
  },
  {
    title: 'Yapay Zeka ve Anomali Tespiti',
    description: 'Veri odaklı zekâ ile anomali tespiti ve karar destek sistemleri.',
    icon: Network,
  },
  {
    title: 'Kapalı Alan Konumlama (Indoor Navigation)',
    description: 'Kapalı alanlarda hassas konumlama teknolojileri ve uygulamaları.',
    icon: MapPin,
  },
  {
    title: 'Sensör Teknolojileri ve Nesnelerin İnterneti (IoT)',
    description: 'Akıllı sensör sistemleri ve uçtan uca IoT çözümleri.',
    icon: RadioTower,
  },
];

export function ResearchAreas() {
  return (
    <section className={styles.section} aria-labelledby="research-areas-title">
      <Container>
        <h2 id="research-areas-title" className={styles.heading}>
          <span className={styles.headingLine} aria-hidden="true" />
          Araştırma Alanları
        </h2>

        <div className={styles.grid}>
          {researchAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article className={styles.card} key={area.title}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon size={31} strokeWidth={1.9} />
                </span>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{area.title}</h3>
                  <p className={styles.cardDescription}>{area.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
