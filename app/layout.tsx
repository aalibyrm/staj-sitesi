import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberSense Lab | Staj Projeleri Arşivi',
  description: 'CyberSense Lab öğrencilerinin siber güvenlik, IoT, web ve yapay zeka projelerini keşfedin.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
