import type { Metadata, Viewport } from 'next';
import './globals.css';
import WatermarkFooter from '@/components/WatermarkFooter';

export const metadata: Metadata = {
  title: 'Nahwu Studio — Pinter Baca Arab & I\'rab Hadis',
  description:
    'Platform telaah teks Arab gundul menjadi lembaran kajian bersyakal presisi, i’rab nahwu lengkap, wazan-tashrif shorof, dan ekspor PDF siap cetak.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0F3A29',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-bgwarm text-ink selection:bg-gold/25 selection:text-forest flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <WatermarkFooter />
      </body>
    </html>
  );
}
