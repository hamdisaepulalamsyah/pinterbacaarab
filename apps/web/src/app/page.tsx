'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Download,
  BookOpen,
  CheckCircle2,
  Check,
  Columns,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import NahwuBadge from '@/components/NahwuBadge';

export default function HomePage() {
  // Interactive demo word state
  const demoWords = [
    {
      ar: 'ذَهَبَ',
      meaning: 'Telah pergi / memborong',
      nahwu: "Fi'il madhi mabni 'alal fathi lazim.",
      wazan: 'فَعَلَ',
      root: 'ذ-ه-ب',
      shighah: "Fi'il Madhi Tsulatsi Mujarrad",
    },
    {
      ar: 'أَهْلُ',
      meaning: 'Pemilik / orang-orang',
      nahwu: "Fa'il marfu' dengan tanda rafa' dhammah zhahirah di akhirnya, wa huwa mudhaf.",
      wazan: 'فَعْلٌ',
      root: 'أ-ه-ل',
      shighah: 'Isim Jamid',
    },
    {
      ar: 'الدُّثُورِ',
      meaning: 'Harta yang melimpah',
      nahwu: "Mudhaf ilaih majrur dengan kasrah zhahirah di akhirnya.",
      wazan: 'فُعُولٌ',
      root: 'د-ث-ر',
      shighah: "Isim Jamak Taksir (Mufrad: Datsr)",
    },
    {
      ar: 'بِالْأُجُورِ',
      meaning: 'Dengan pahala yang banyak',
      nahwu: "Ba' adalah huruf jar mabni; al-ujur isim majrur bil-ba' wa 'alamatu jarrihi al-kasrah.",
      wazan: 'فُعُولٌ',
      root: 'أ-ج-ر',
      shighah: "Jar Majrur (Mufrad: Ajr)",
    },
  ];

  const [activeDemoWord, setActiveDemoWord] = useState(demoWords[0]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full space-y-20">
        {/* Hero Section: Editorial Asymmetric Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 6 Columns: Value Proposition & Intent */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-ink-secondary shadow-minimal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
              <span>Model Bahasa Khusus Lughah &amp; I&apos;rab</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink font-normal leading-[1.12] tracking-tight">
              Membaca Matan Arab dengan Ketelitian{' '}
              <span className="italic text-cedar">Nahwu &amp; Shorof</span>
            </h1>

            <p className="text-base text-ink-secondary leading-relaxed max-w-xl">
              Ubah teks hadis dan kutipan kitab Arab gundul menjadi naskah bersyakal presisi, bedah
              I&apos;rab kata per kata, wazan dan akar kata shorof, serta ekspor modul PDF format
              majelis ilmu.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/new"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-ink hover:bg-stone-800 text-surface font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-minimal active:scale-95"
              >
                <span>Mulai Analisis Matan</span>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </Link>
              <Link
                href="/library"
                className="w-full sm:w-auto px-5 py-3 rounded-lg border border-border bg-surface hover:bg-subtle text-ink-secondary text-xs sm:text-sm font-medium transition text-center"
              >
                Buka Koleksi Arsip
              </Link>
            </div>

            {/* Quick Proof Points */}
            <div className="pt-4 border-t border-borderlight flex items-center gap-6 text-xs text-ink-muted font-mono">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>100% Konsonan Identik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>Format Cetak A4 Landscape</span>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: The Real Product Hero Moment (Interactive Dissection Workbench) */}
          <div className="lg:col-span-6">
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-float space-y-5">
              <div className="flex items-center justify-between border-b border-borderlight pb-3 text-xs font-mono text-ink-muted">
                <span>Contoh Interaktif • Shahih Muslim No. 1006</span>
                <span className="text-emerald-800 font-medium">Klik lafaz untuk membedah</span>
              </div>

              {/* Matan with Clickable Word Badges */}
              <div className="p-5 rounded-xl bg-subtle/50 text-right space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block text-left">
                  Matan Bersyakal
                </span>
                <div className="font-arabic text-3xl sm:text-4xl leading-[2.5] text-ink flex flex-wrap flex-row-reverse gap-2 items-center justify-end">
                  {demoWords.map((w) => {
                    const isSelected = activeDemoWord.ar === w.ar;
                    return (
                      <button
                        key={w.ar}
                        type="button"
                        onClick={() => setActiveDemoWord(w)}
                        className={`font-arabic px-2 py-0.5 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-ink text-surface font-bold shadow-minimal scale-105'
                            : 'hover:bg-subtle hover:text-cedar'
                        }`}
                      >
                        {w.ar}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Word Dissection Inspector Card */}
              <div className="p-4 rounded-xl border border-borderlight bg-surface space-y-3">
                <div className="flex items-baseline justify-between border-b border-borderlight pb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-arabic text-2xl font-bold text-ink">
                      {activeDemoWord.ar}
                    </span>
                    <span className="text-xs text-ink-secondary font-medium">
                      ({activeDemoWord.meaning})
                    </span>
                  </div>
                  <NahwuBadge nahwuText={activeDemoWord.nahwu} />
                </div>

                <div className="text-xs text-ink-tertiary leading-relaxed">
                  <span className="font-mono text-ink-muted mr-1">I&apos;rab:</span>
                  <span>{activeDemoWord.nahwu}</span>
                </div>

                <div className="pt-2 border-t border-borderlight grid grid-cols-2 gap-2 text-xs font-mono text-ink-secondary">
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase">Wazan</span>
                    <span className="font-arabic text-sm text-ink">{activeDemoWord.wazan}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase">Akar Kata</span>
                    <span className="text-ink font-semibold">{activeDemoWord.root}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid: Clean, Unslopt, 4 Solid Tools */}
        <section className="space-y-6 pt-8 border-t border-border">
          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted block mb-1">
              Alat &amp; Fitur Kajian
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              Dirancang untuk Penuntut Ilmu &amp; Pengajar Bahasa Arab
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3">
              <span className="font-mono text-xs text-ink-muted">01</span>
              <h3 className="font-serif text-lg text-ink font-medium">
                Pembedah Matan Interaktif
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Setiap kata dalam kalimat dipetakan ke fungsi gramatikanya: Mubtada&apos;, Khabar,
                Fa&apos;il, Maf&apos;ul, Mudhaf Ilaih, dan Huruf Jar dengan tanda I&apos;rab presisi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3">
              <span className="font-mono text-xs text-ink-muted">02</span>
              <h3 className="font-serif text-lg text-ink font-medium">
                Morfologi &amp; Tashrif Shorof
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Identifikasi akar huruf (Fa-&apos;Ain-Lam), wazan mujarrad maupun mazid, serta
                perubahan shighah fi&apos;il madhi, mudhari&apos;, masdar, hingga isim fa&apos;il.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3">
              <span className="font-mono text-xs text-ink-muted">03</span>
              <h3 className="font-serif text-lg text-ink font-medium">
                Modul Cetak PDF Majelis
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Ubah berkas digital menjadi lembaran cetak A4 landscape 4 kolom berfont Amiri resmi,
                siap difotokopi untuk materi kajian pesantren atau santri.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-ink-muted bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-serif italic text-ink-secondary font-medium">Nahwu Studio</span>
          <span>Khidmah Pembelajaran Bahasa Arab &amp; Ulumul Hadis</span>
        </div>
      </footer>
    </div>
  );
}
