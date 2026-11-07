'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Check,
  Play,
  Pause,
  RotateCcw,
  Layers,
  FileText,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import NahwuBadge from '@/components/NahwuBadge';

interface DemoWord {
  ar: string;
  meaning: string;
  nahwu: string;
  wazan: string;
  root: string;
  shighah: string;
}

interface DemoSample {
  id: string;
  title: string;
  source: string;
  words: DemoWord[];
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'dutsur',
    title: 'Hadis Ahli Dutsur',
    source: 'Shahih Muslim No. 1006',
    words: [
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
        nahwu: 'Mudhaf ilaih majrur dengan kasrah zhahirah di akhirnya.',
        wazan: 'فُعُولٌ',
        root: 'د-ث-ر',
        shighah: 'Isim Jamak Taksir (Mufrad: Datsr)',
      },
      {
        ar: 'بِالْأُجُورِ',
        meaning: 'Dengan pahala yang banyak',
        nahwu: "Ba' adalah huruf jar mabni; al-ujur isim majrur bil-ba' wa 'alamatu jarrihi al-kasrah.",
        wazan: 'فُعُولٌ',
        root: 'أ-ج-ر',
        shighah: 'Jar Majrur (Mufrad: Ajr)',
      },
    ],
  },
  {
    id: 'niyat',
    title: 'Hadis Niat',
    source: 'Shahih Al-Bukhari No. 1',
    words: [
      {
        ar: 'إِنَّمَا',
        meaning: 'Hanyasanya / sesungguhnya',
        nahwu: 'Kaffah wa makfufah, adatul hashr (perangkat pembatas makna).',
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Adatul Hashr Mabniyah',
      },
      {
        ar: 'الْأَعْمَالُ',
        meaning: 'Segala amal perbuatan',
        nahwu: "Mubtada' marfu' dengan tanda rafa' dhammah zhahirah di akhirnya.",
        wazan: 'أَفْعَالٌ',
        root: 'ع-م-ل',
        shighah: "Isim Jamak Taksir (Mufrad: 'Amal)",
      },
      {
        ar: 'بِالنِّيَّاتِ',
        meaning: 'Bergantung pada niatnya',
        nahwu: "Sibh al-jumlah (jar majrur) fi mahalli raf'in khabar al-mubtada'.",
        wazan: 'فِعْلَاتٌ',
        root: 'ن-و-ي',
        shighah: 'Jar Majrur (Mufrad: Niyyah)',
      },
    ],
  },
  {
    id: 'arkan',
    title: 'Rukun Islam',
    source: 'Shahih Al-Bukhari No. 8',
    words: [
      {
        ar: 'بُنِيَ',
        meaning: 'Telah ditegakkan / dibangun',
        nahwu: "Fi'il madhi mabni lil-majhul (pasif), mabni 'alal fathi.",
        wazan: 'فُعِلَ',
        root: 'ب-ن-ي',
        shighah: "Fi'il Madhi Mabni Majhul",
      },
      {
        ar: 'الْإِسْلَامُ',
        meaning: 'Agama Islam',
        nahwu: "Na'ibul fa'il marfu' dengan tanda rafa' dhammah zhahirah.",
        wazan: 'إِفْعَالٌ',
        root: 'س-ل-م',
        shighah: 'Masdar Tsulatsi Mazid bi Hamzah',
      },
      {
        ar: 'عَلَى',
        meaning: 'Di atas / pondasi',
        nahwu: "Harf jar mabni 'alas sukun, la mahalla lahu minal i'rab.",
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Jar Mabni',
      },
      {
        ar: 'خَمْسٍ',
        meaning: 'Lima rukun pokok',
        nahwu: "Isim majrur bi 'ala wa 'alamatu jarrihi al-kasrah azh-zhahirah.",
        wazan: 'فَعْلٌ',
        root: 'خ-م-س',
        shighah: "'Adad Asli Mufrad",
      },
    ],
  },
  {
    id: 'qawaid',
    title: 'Kaidah Fiqhiyyah',
    source: 'Al-Asybah wan Nazha-ir',
    words: [
      {
        ar: 'الْأُمُورُ',
        meaning: 'Segala urusan / perkara',
        nahwu: "Mubtada' marfu' dengan tanda rafa' dhammah zhahirah.",
        wazan: 'فُعُولٌ',
        root: 'أ-م-ر',
        shighah: 'Isim Jamak Taksir (Mufrad: Amr)',
      },
      {
        ar: 'بِمَقَاصِدِهَا',
        meaning: 'Menurut maksud tujuannya',
        nahwu: "Jar wa majrur fi mahalli raf'in khabar; ha' dhamir muttashil fi mahalli jarr mudhaf ilaih.",
        wazan: 'مَفَاعِلٌ',
        root: 'ق-ص-د',
        shighah: 'Shighah Muntahal Jumu’',
      },
    ],
  },
  {
    id: 'ihsan',
    title: 'Tingkatan Ihsan',
    source: 'Shahih Muslim No. 8',
    words: [
      {
        ar: 'أَنْ',
        meaning: 'Bahwasanya',
        nahwu: "Harf mashdariyyah wa nashb mabni 'alas sukun.",
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Mashdari wa Nashb',
      },
      {
        ar: 'تَعْبُدَ',
        meaning: 'Engkau menyembah / beribadah',
        nahwu: "Fi'il mudhari' manshub bi 'an wa 'alamatu nashbihi al-fathah; fa'il dhamir mustatir taqdiruhu anta.",
        wazan: 'تَفْعُلَ',
        root: 'ع-ب-د',
        shighah: "Fi'il Mudhari' Tsulatsi Mujarrad",
      },
      {
        ar: 'اللَّهَ',
        meaning: 'Allah (Lafzhul Jalalah)',
        nahwu: "Lafzhul Jalalah maf'ul bihi manshub dengan fathah zhahirah.",
        wazan: '—',
        root: 'أ-ل-ه',
        shighah: 'Isim Alam (Lafzhul Jalalah)',
      },
      {
        ar: 'كَأَنَّكَ',
        meaning: 'Seakan-akan engkau',
        nahwu: "Ka'anna harf tasybih wa nashb; kaf dhamir muttashil fi mahalli nashbin ismu ka'anna.",
        wazan: 'حَرْفٌ',
        root: '—',
        shighah: 'Harf Tasybih wa Nashb',
      },
      {
        ar: 'تَرَاهُ',
        meaning: 'Melihat-Nya',
        nahwu: "Jumlah fi'liyyah fi mahalli raf'in khabar ka'anna; ha' maf'ul bihi.",
        wazan: 'تَفْعَاهُ',
        root: 'ر-أ-ي',
        shighah: "Fi'il Mudhari' Mu'tal Akhir (Naqis)",
      },
    ],
  },
];

export default function HomePage() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const userInteractedTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentSample = DEMO_SAMPLES[activeSampleIndex];
  const activeWord = currentSample.words[activeWordIndex] || currentSample.words[0];

  // Auto-advance word every 2.8 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveWordIndex((prevIndex) => {
        const nextWordIndex = prevIndex + 1;
        if (nextWordIndex < currentSample.words.length) {
          return nextWordIndex;
        } else {
          // Move to next sample automatically for a living experience
          setActiveSampleIndex((prevSample) => (prevSample + 1) % DEMO_SAMPLES.length);
          return 0;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSample.words.length]);

  // Handle user manual word select
  const handleSelectWord = (index: number) => {
    setActiveWordIndex(index);
    pauseBrieflyAndResume();
  };

  // Handle sample change
  const handleSelectSample = (sampleIdx: number) => {
    setActiveSampleIndex(sampleIdx);
    setActiveWordIndex(0);
    pauseBrieflyAndResume();
  };

  const pauseBrieflyAndResume = () => {
    setIsAutoPlaying(false);
    if (userInteractedTimeout.current) clearTimeout(userInteractedTimeout.current);
    // Resume auto-play after 8 seconds of inactivity
    userInteractedTimeout.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  };

  const toggleAutoPlay = () => {
    if (userInteractedTimeout.current) clearTimeout(userInteractedTimeout.current);
    setIsAutoPlaying((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas bg-ambient-fluid text-ink">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full space-y-20 animate-fadeSlideUp">
        {/* Hero Section: Editorial Asymmetric Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 6 Columns: Value Proposition & Intent */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-surface/90 text-xs font-mono text-ink-secondary shadow-minimal backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cedar animate-pulse"></span>
              <span>Platform Telaah &amp; Bedah Nahwu-Shorof</span>
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
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-ink hover:bg-stone-800 text-surface font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-minimal active:scale-95 group"
              >
                <span>Mulai Analisis Matan</span>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/practice"
                className="w-full sm:w-auto px-5 py-3 rounded-lg border border-ochre/40 bg-ochre-soft/80 hover:bg-ochre-soft text-ochre text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal"
              >
                <span>Latihan Baca Arab</span>
                <span className="text-[10px] bg-ochre text-surface px-1.5 py-0.5 rounded-full font-mono">Baru</span>
              </Link>
              <Link
                href="/library"
                className="w-full sm:w-auto px-5 py-3 rounded-lg border border-border bg-surface hover:bg-subtle text-ink-secondary text-xs sm:text-sm font-medium transition text-center"
              >
                Buka Arsip
              </Link>
            </div>

            {/* Quick Proof Points */}
            <div className="pt-4 border-t border-borderlight flex items-center gap-6 text-xs text-ink-muted font-mono">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>100% Huruf Konsonan Terjaga</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>Format Cetak A4 Landscape</span>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Living Auto-Advancing Workbench */}
          <div className="lg:col-span-6">
            <div className="bg-surface/95 backdrop-blur-md rounded-2xl border border-border p-5 sm:p-7 shadow-float space-y-5 relative overflow-hidden">
              {/* Subtle accent bar on top indicating active auto play */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-borderlight overflow-hidden">
                {isAutoPlaying && (
                  <div
                    key={`${activeSampleIndex}-${activeWordIndex}`}
                    className="h-full bg-cedar animate-[shrink_2.8s_linear_forwards]"
                    style={{
                      animation: 'progressFill 2.8s linear infinite',
                    }}
                  />
                )}
              </div>

              {/* Sample Tabs & Auto-Play Controller */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-borderlight pb-3">
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
                  {DEMO_SAMPLES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSample(idx)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                        idx === activeSampleIndex
                          ? 'bg-cedar/10 text-cedar font-semibold border border-cedar/30'
                          : 'text-ink-muted hover:text-ink hover:bg-subtle'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={toggleAutoPlay}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border transition ${
                      isAutoPlaying
                        ? 'border-emerald-700/30 bg-emerald-50 text-emerald-800'
                        : 'border-border text-ink-muted hover:bg-subtle'
                    }`}
                    title={isAutoPlaying ? 'Klik untuk menjeda animasi' : 'Klik untuk memutar animasi'}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-2.5 h-2.5" />
                        <span>Otomatis</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5" />
                        <span>Putar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Matan Source Subtitle */}
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>{currentSample.source}</span>
                <span className="text-cedar font-medium">Klik lafaz untuk membedah</span>
              </div>

              {/* Matan Box with Unclipped Arabic Word Pills */}
              <div className="p-5 sm:p-6 rounded-xl bg-subtle/50 text-right space-y-2 select-none">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block text-left">
                  Matan Bersyakal
                </span>
                <div
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-3xl sm:text-4xl text-ink text-right flex flex-wrap justify-end items-center gap-y-3 gap-x-1 select-none overflow-visible leading-[3] sm:leading-[3.2]"
                >
                  {currentSample.words.map((w, idx) => {
                    const isSelected = idx === activeWordIndex;
                    return (
                      <button
                        key={`${w.ar}-${idx}`}
                        type="button"
                        onClick={() => handleSelectWord(idx)}
                        className={`relative inline-flex items-center justify-center font-arabic px-3.5 py-2 rounded-xl transition-all duration-300 ease-fluid cursor-pointer select-none outline-none focus:outline-none ${
                          isSelected
                            ? 'bg-cedar text-surface font-bold shadow-float scale-105 ring-2 ring-cedar/40'
                            : 'text-ink hover:bg-surface hover:text-cedar hover:shadow-minimal'
                        }`}
                      >
                        <span className="relative z-10 block pointer-events-none">{w.ar}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Word Dissection Inspector Card */}
              <div
                key={`${currentSample.id}-${activeWord.ar}-${activeWordIndex}`}
                className="p-4 sm:p-5 rounded-xl border border-borderlight bg-surface space-y-3 animate-fadeSlideUp transition-all duration-300 shadow-minimal"
              >
                <div className="flex items-baseline justify-between border-b border-borderlight pb-2">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-arabic text-2xl sm:text-3xl font-bold text-ink select-none leading-relaxed">
                      {activeWord.ar}
                    </span>
                    <span className="text-xs text-ink-secondary font-medium">
                      ({activeWord.meaning})
                    </span>
                  </div>
                  <NahwuBadge nahwuText={activeWord.nahwu} />
                </div>

                <div className="text-xs text-ink-tertiary leading-relaxed">
                  <span className="font-mono text-ink-muted mr-1.5 font-medium">I&apos;rab:</span>
                  <span>{activeWord.nahwu}</span>
                </div>

                <div className="pt-2 border-t border-borderlight grid grid-cols-3 gap-2 text-xs font-mono text-ink-secondary">
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase">Wazan</span>
                    <span className="font-arabic text-sm text-ink font-medium">{activeWord.wazan}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase">Akar Kata</span>
                    <span className="text-ink font-semibold">{activeWord.root}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase">Shighah</span>
                    <span className="text-ink text-[11px] truncate block" title={activeWord.shighah}>
                      {activeWord.shighah}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid: 3 Solid Pillars */}
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
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3 transition-all duration-300 ease-fluid hover:-translate-y-1 hover:shadow-float hover:border-cedar/30 group">
              <span className="font-mono text-xs text-ink-muted group-hover:text-cedar transition-colors">01</span>
              <h3 className="font-serif text-lg text-ink font-medium group-hover:text-cedar transition-colors">
                Pembedah Matan Interaktif
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Setiap kata dalam kalimat dipetakan ke fungsi gramatikanya: Mubtada&apos;, Khabar,
                Fa&apos;il, Maf&apos;ul, Mudhaf Ilaih, dan Huruf Jar dengan tanda I&apos;rab presisi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3 transition-all duration-300 ease-fluid hover:-translate-y-1 hover:shadow-float hover:border-ochre/30 group">
              <span className="font-mono text-xs text-ink-muted group-hover:text-ochre transition-colors">02</span>
              <h3 className="font-serif text-lg text-ink font-medium group-hover:text-ochre transition-colors">
                Morfologi &amp; Tashrif Shorof
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Identifikasi akar huruf (Fa-&apos;Ain-Lam), wazan mujarrad maupun mazid, serta
                perubahan shighah fi&apos;il madhi, mudhari&apos;, masdar, hingga isim fa&apos;il.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-surface border border-border shadow-minimal space-y-3 transition-all duration-300 ease-fluid hover:-translate-y-1 hover:shadow-float hover:border-cedar/30 group">
              <span className="font-mono text-xs text-ink-muted group-hover:text-cedar transition-colors">03</span>
              <h3 className="font-serif text-lg text-ink font-medium group-hover:text-cedar transition-colors">
                Modul Cetak PDF Majelis
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Ubah berkas digital menjadi lembaran cetak A4 landscape 4 kolom berfont Amiri resmi,
                siap difotokopi untuk materi kajian santri dan thalabul &apos;ilmi.
              </p>
            </div>
          </div>

          {/* Featured Practice Banner */}
          <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-cedar-soft/70 via-surface to-ochre-soft/70 border border-border shadow-float flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-xs font-mono text-ochre font-semibold tracking-wider uppercase block">
                Latihan Baca Arab Gundul
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                Belum Lancar Membaca Naskah Gundul? Latihan Bersama Asisten
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Tebak kedudukan nahwu dan harakat akhir kata per kata. Dilengkapi penjelasan langsung saat salah menjawab, serta opsi latihan menggunakan teks dari arsip kajianmu.
              </p>
            </div>
            <Link
              href="/practice"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal shrink-0 active:scale-95"
            >
              <span>Mulai Latihan Baca</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}