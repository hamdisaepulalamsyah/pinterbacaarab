import type { Metadata, Viewport } from 'next';
import './globals.css';
import WatermarkFooter from '@/components/WatermarkFooter';

export const metadata: Metadata = {
  title: 'PinterBacaArab — Bedah Nahwu & Shorof Hadis',
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
      <body className="antialiased min-h-screen bg-parchment-texture text-ink selection:bg-gold/25 selection:text-forest flex flex-col justify-between relative overflow-x-hidden">
        {/* Subtle Ambient Floating Aurora Backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
          <div className="absolute -top-[15%] left-[10%] w-[450px] h-[450px] rounded-full bg-cedar-soft/40 blur-[90px] animate-aurora" />
          <div className="absolute top-[35%] -right-[10%] w-[400px] h-[400px] rounded-full bg-ochre-soft/50 blur-[90px] animate-aurora [animation-delay:-5s]" />
          <div className="absolute -bottom-[10%] left-[25%] w-[500px] h-[500px] rounded-full bg-emerald-50/40 blur-[110px] animate-aurora [animation-delay:-10s]" />
        </div>

        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <WatermarkFooter />
      </body>
    </html>
  );
}
