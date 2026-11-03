import Link from 'next/link';
import { ArrowRight, ShieldCheck, Download, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-3xl mx-auto px-5 py-16 md:py-24 w-full flex flex-col items-center text-center">
        {/* Subtitle Monogram */}
        <span className="font-serif italic text-base text-ink-tertiary mb-3">
          Telaah Bahasa &amp; Matan
        </span>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-6xl text-ink font-normal leading-[1.12] mb-6 tracking-tight">
          Membaca Teks Arab dengan Timbangan{' '}
          <span className="italic text-cedar">Nahwu &amp; Shorof</span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="text-base sm:text-lg text-ink-secondary max-w-xl mb-10 leading-relaxed font-normal">
          Ubah kutipan hadis dan matan kitab Arab gundul menjadi naskah bersyakal presisi, bedah
          I&apos;rab setiap kata, wazan shorof, dan ekspor lembar PDF siap kaji.
        </p>

        {/* Minimalist Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-20">
          <Link
            href="/new"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-ink hover:bg-stone-800 text-surface font-medium transition flex items-center justify-center gap-2 text-sm shadow-minimal active:scale-95"
          >
            <span>Mulai Kajian Matan</span>
            <ArrowRight className="w-4 h-4 text-stone-300" />
          </Link>
          <Link
            href="/library"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-border bg-surface hover:bg-subtle text-ink-secondary text-sm font-medium transition"
          >
            Buka Koleksi Arsip
          </Link>
        </div>

        {/* Sample Matan Card (Zen Minimalist Preview) */}
        <div className="w-full text-left bg-surface rounded-2xl p-6 sm:p-8 border border-borderlight shadow-minimal mb-20">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-borderlight text-xs font-mono text-ink-muted">
            <span>Shahih Muslim No. 1006</span>
            <span className="text-emerald-800 font-medium">100% Konsonan Identik</span>
          </div>

          {/* Large Arabic Line */}
          <div className="text-right py-4 mb-4">
            <span className="font-arabic text-3xl sm:text-4xl leading-[2.5] text-ink select-text block">
              ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ
            </span>
          </div>

          {/* Terjemah Serif */}
          <p className="font-serif italic text-base sm:text-lg text-ink-secondary leading-relaxed mb-6">
            &ldquo;Orang-orang kaya telah memborong pahala yang banyak...&rdquo;
          </p>

          {/* Minimal Word Breakdown Rows */}
          <div className="divide-y divide-borderlight text-xs pt-2">
            <div className="py-2.5 flex items-baseline justify-between">
              <span className="font-arabic text-xl font-bold text-ink">ذَهَبَ</span>
              <span className="text-ink-secondary">Telah pergi / membawa</span>
              <span className="text-stone-500 font-mono">Fi&apos;il Madhi (مبني)</span>
              <span className="font-arabic text-sm text-ink-tertiary">فَعَلَ</span>
            </div>
            <div className="py-2.5 flex items-baseline justify-between">
              <span className="font-arabic text-xl font-bold text-ink">أَهْلُ</span>
              <span className="text-ink-secondary">Pemilik / Orang</span>
              <span className="text-emerald-800 font-mono">Fa&apos;il (مرفوع)</span>
              <span className="font-arabic text-sm text-ink-tertiary">فَعْلٌ</span>
            </div>
            <div className="py-2.5 flex items-baseline justify-between">
              <span className="font-arabic text-xl font-bold text-ink">الدُّثُورِ</span>
              <span className="text-ink-secondary">Harta yang melimpah</span>
              <span className="text-rose-800 font-mono">Mudhaf Ilaih (مجرور)</span>
              <span className="font-arabic text-sm text-ink-tertiary">فُعُولٌ</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Flow (Quiet, spacious, dignified) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left pt-6 border-t border-borderlight">
          <div className="space-y-2">
            <span className="font-mono text-xs text-ink-muted uppercase tracking-widest block">
              01 • Integritas
            </span>
            <h4 className="font-serif text-lg text-ink font-normal">Konsonan Huruf Terjaga</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Model dilarang menukar atau mengubah huruf asli teks sumber. Hanya harakat syakal yang
              dibubuhkan dengan validasi dua arah.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-ink-muted uppercase tracking-widest block">
              02 • Sintaksis
            </span>
            <h4 className="font-serif text-lg text-ink font-normal">Tafshil Nahwu &amp; Shorof</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Membedah kedudukan I&apos;rab (Rafa&apos;, Nashab, Jar, Jazm, Mabni) beserta wazan
              shorof dan akar kata per lafaz.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-ink-muted uppercase tracking-widest block">
              03 • Publikasi
            </span>
            <h4 className="font-serif text-lg text-ink font-normal">Ekspor PDF A4 Landscape</h4>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Cetak modul kajian rapi berfont Naskh Amiri resmi, siap dibagikan ke majelis taklim
              atau arsip santri.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-borderlight py-8 text-center text-xs text-ink-muted">
        <div className="max-w-3xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif italic text-ink-tertiary">Nahwu Studio</span>
          <span>Khidmah Ilmu Lughah Arabiyyah</span>
        </div>
      </footer>
    </div>
  );
}
