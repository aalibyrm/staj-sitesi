import type { Project } from '../types/project';

const placeholder = '/project-placeholder.svg';

export const projects: Project[] = [
  { id: 'iomt-network-attack-scenarios', slug: 'iomt-network-attack-scenarios', title: 'IoMT Network Attack Scenarios', category: 'Siber Güvenlik', description: 'IoMT ortamlarında ağ saldırı senaryolarının simülasyonu ve güvenlik analizlerinin gerçekleştirilmesi.', image: placeholder, student: { name: 'Okan Koca', department: 'Bilgisayar Mühendisliği', avatar: '' }, year: 2026 },
  { id: 'akilli-tarim-izleme-sistemi', slug: 'akilli-tarim-izleme-sistemi', title: 'Akıllı Tarım İzleme Sistemi', category: 'IoT', description: 'Tarım arazilerinde çevresel verileri toplayan ve gerçek zamanlı izleme sağlayan IoT tabanlı sistem.', image: placeholder, student: { name: 'Elif Yılmaz', department: 'Elektrik-Elektronik Mühendisliği', avatar: '' }, year: 2026 },
  { id: 'hastaneler-icin-federated-learning', slug: 'hastaneler-icin-federated-learning', title: 'Hastaneler İçin Federated Learning', category: 'Yapay Zeka', description: 'Hassas sağlık verilerinin gizliliğini koruyarak federe öğrenme ile model geliştirme.', image: placeholder, student: { name: 'Mehmet Arslan', department: 'Bilgisayar Mühendisliği', avatar: '' }, year: 2026 },
  { id: 'universite-etkinlik-platformu', slug: 'universite-etkinlik-platformu', title: 'Üniversite Etkinlik Platformu', category: 'Web', description: 'Öğrencilerin etkinlikleri keşfedip katılım sağlayabileceği modern bir web platformu.', image: placeholder, student: { name: 'Zeynep Demir', department: 'Yazılım Mühendisliği', avatar: '' }, year: 2026 },
  { id: 'akilli-ev-enerji-yonetim-sistemi', slug: 'akilli-ev-enerji-yonetim-sistemi', title: 'Akıllı Ev Enerji Yönetim Sistemi', category: 'IoT', description: 'Ev enerji tüketimini izleyen ve otomatik optimizasyon sağlayan akıllı sistem.', image: placeholder, student: { name: 'Ahmet Kaya', department: 'Mekatronik Mühendisliği', avatar: '' }, year: 2026 },
  { id: 'trafik-levhasi-tanima-sistemi', slug: 'trafik-levhasi-tanima-sistemi', title: 'Trafik Levhası Tanıma Sistemi', category: 'Yapay Zeka', description: 'Derin öğrenme yöntemleri ile trafik levhalarının otomatik olarak tanınması.', image: placeholder, student: { name: 'Berk Can', department: 'Bilgisayar Mühendisliği', avatar: '' }, year: 2026 },
];

export const archiveYears = [2024, 2025, 2026] as const;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
