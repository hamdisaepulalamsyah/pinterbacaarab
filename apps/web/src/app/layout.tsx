import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nahwu Studio — Pinter Baca Arab & Analisis Hadis',
  description:
    'Web app pengubah teks Arab gundul menjadi PDF kajian rapi: bersyakal, terjemah Indonesia, i’rab nahwu, dan wazan shorof.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-bgwarm text-ink">{children}</body>
    </html>
  );
}
