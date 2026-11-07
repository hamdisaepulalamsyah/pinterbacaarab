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
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 w-full space-y-16 sm:space-y-24 animate-fadeSlideUp">
        {/* Hero Section: Editorial Asymmetric Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left 6 Columns: Value Proposition & Intent */}
          <div className="lg:col-span-6 space-y-6 text-left">
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
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ink hover:bg-stone-800 text-surface font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-minimal active:scale-95 group"
              >
                <span>Mulai Analisis Matan</span>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/practice"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-ochre/40 bg-ochre-soft/80 hover:bg-ochre-soft text-ochre text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal active:scale-95"
              >
                <span>Latihan Baca Arab</span>
              </Link>
              <Link
                href="/library"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-surface hover:bg-subtle text-ink-secondary text-xs sm:text-sm font-medium transition text-center"
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
            <div className="bg-surface/95 backdrop-blur-md rounded-2xl border border-border p-5 sm:p-6 shadow-float space-y-4 relative overflow-hidden">
              {/* Subtle accent bar on top indicating active auto play */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-borderlight overflow-hidden">
                <div
                  key={`${activeSampleIndex}-${activeWordIndex}`}
                  className="h-full bg-cedar animate-[shrink_2.8s_linear_forwards]"
                  style={{
                    animation: 'progressFill 2.8s linear infinite',
                  }}
                />
              </div>

              {/* Sample Tabs & Living Auto-Ticker Indicator */}
              <div className="flex items-center justify-between gap-2 border-b border-borderlight pb-3">
                <div className="flex items-center gap-1 overflow-x-auto max-w-[70%] sm:max-w-none scrollbar-none">
                  {DEMO_SAMPLES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSample(idx)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                        idx === activeSampleIndex
                          ? 'bg-cedar/10 text-cedar font-semibold border border-cedar/30'
                          : 'text-ink-muted hover:text-ink hover:bg-subtle'
                      }`}
                    >
                      {s.title.replace('Hadis ', '')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cedar shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-cedar animate-pulse"></span>
                  <span className="hidden sm:inline">Telaah Aktif</span>
                </div>
              </div>

              {/* Matan Source Subtitle */}
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>{currentSample.source}</span>
                <span className="text-cedar font-medium">Klik lafaz untuk membedah</span>
              </div>

              {/* Matan Box with Natural Word Proportions (Anti-Stretched) */}
              <div className="p-4 sm:p-5 rounded-xl bg-subtle/50 text-right space-y-1.5 select-none border border-borderlight/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block text-left">
                  Matan Bersyakal
                </span>
                <div
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-2xl sm:text-3xl text-ink text-right flex flex-wrap justify-end items-center gap-2 sm:gap-2.5 py-2 select-none overflow-visible"
                >
                  {currentSample.words.map((w, idx) => {
                    const isSelected = idx === activeWordIndex;
                    return (
                      <button
                        key={`${w.ar}-${idx}`}
                        type="button"
                        onClick={() => handleSelectWord(idx)}
                        className={`h-auto self-center font-arabic px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl transition-all duration-300 ease-fluid cursor-pointer select-none outline-none leading-normal ${
                          isSelected
                            ? 'bg-cedar text-surface font-bold shadow-minimal scale-105 ring-2 ring-cedar/25'
                            : 'text-ink hover:bg-surface hover:text-cedar'
                        }`}
                      >
                        <span className="block leading-normal">{w.ar}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Word Dissection Inspector Card */}
              <div
                key={`${currentSample.id}-${activeWord.ar}-${activeWordIndex}`}
                className="p-4 rounded-xl border border-borderlight bg-surface space-y-3 animate-fadeSlideUp transition-all duration-300 shadow-minimal"
              >
                <div className="flex items-baseline justify-between border-b border-borderlight pb-2">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-arabic text-2xl sm:text-3xl font-bold text-ink select-none leading-normal">
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

        {/* Authentic Scholarly Architecture Section (Creative & Non-Generic) */}
        <section className="space-y-8 pt-6 border-t border-border">
          <div className="max-w-2xl text-left space-y-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-ochre font-semibold block">
              Metodologi &amp; Anatomi Telaah
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              Standar Keilmuan Bahasa Arab untuk Majelis &amp; Thalabul &apos;Ilmi
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Setiap lafaz diurai secara presisi mengikuti kaidah nahwu klasik dan timbangan shorof, siap diajarkan maupun dicetak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual Module 1: Syntax Tree */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-minimal space-y-4 transition-all duration-300 hover:shadow-float hover:border-cedar/40 group">
              <div className="flex items-center justify-between border-b border-borderlight pb-3">
                <span className="font-serif font-semibold text-base text-ink group-hover:text-cedar transition-colors">
                  Pembedah I&apos;rab Kalimat
                </span>
                <span className="text-[10px] font-mono text-ink-muted px-2 py-0.5 rounded bg-subtle">
                  Nahwu
                </span>
              </div>

              {/* Visual Syntax Tree Preview */}
              <div className="p-3.5 rounded-xl bg-subtle/60 border border-borderlight space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>Alur Fungsi Sintaksis:</span>
                  <span className="text-emerald-800 font-semibold">Terkoneksi Presisi</span>
                </div>
                <div className="flex items-center justify-between gap-1 text-center">
                  <div className="flex-1 p-2 rounded-lg bg-surface border border-borderlight">
                    <span className="font-arabic text-sm text-ink block">فِعْلٌ</span>
                    <span className="text-[9px] font-mono text-ink-muted">Kata Kerja</span>
                  </div>
                  <span className="text-xs text-ink-muted">→</span>
                  <div className="flex-1 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-arabic text-sm text-emerald-900 font-bold block">فَاعِلٌ</span>
                    <span className="text-[9px] font-mono text-emerald-700">Marfu&apos;</span>
                  </div>
                  <span className="text-xs text-ink-muted">→</span>
                  <div className="flex-1 p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-arabic text-sm text-amber-900 font-bold block">مَفْعُولٌ</span>
                    <span className="text-[9px] font-mono text-amber-700">Manshub</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                Memetakan setiap lafaz ke kedudukan gramatikanya: Mubtada&apos;, Khabar, Fa&apos;il,
                Maf&apos;ul, Mudhaf Ilaih, hingga Jar Majrur lengkap dengan tanda i&apos;rab zhahirah maupun muqaddarah.
              </p>
            </div>

            {/* Visual Module 2: Morphological Root Matrix */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-minimal space-y-4 transition-all duration-300 hover:shadow-float hover:border-ochre/40 group">
              <div className="flex items-center justify-between border-b border-borderlight pb-3">
                <span className="font-serif font-semibold text-base text-ink group-hover:text-ochre transition-colors">
                  Timbangan Tashrif Shorof
                </span>
                <span className="text-[10px] font-mono text-ink-muted px-2 py-0.5 rounded bg-subtle">
                  Morfologi
                </span>
              </div>

              {/* Visual Wazan Matrix Preview */}
              <div className="p-3.5 rounded-xl bg-subtle/60 border border-borderlight space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>Akar Huruf: <strong className="text-ink">ف - ع - ل</strong></span>
                  <span className="text-ochre font-semibold">22 Wazan</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-surface border border-borderlight">
                    <span className="font-arabic text-xs font-semibold text-ink block">فَعَلَ</span>
                    <span className="text-[9px] font-mono text-ink-muted">Madhi</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface border border-borderlight">
                    <span className="font-arabic text-xs font-semibold text-ink block">يَفْعُلُ</span>
                    <span className="text-[9px] font-mono text-ink-muted">Mudhari&apos;</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface border border-borderlight">
                    <span className="font-arabic text-xs font-semibold text-ink block">فَعْلًا</span>
                    <span className="text-[9px] font-mono text-ink-muted">Masdar</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                Membongkar perubahan bentuk kata dari akar konsonan asli (Tsulatsi Mujarrad &amp; Mazid),
                membedakan fi&apos;il madhi, mudhari&apos;, isim fa&apos;il, isim maf&apos;ul, hingga masdar mimi.
              </p>
            </div>

            {/* Visual Module 3: PDF Handout Format */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-minimal space-y-4 transition-all duration-300 hover:shadow-float hover:border-cedar/40 group">
              <div className="flex items-center justify-between border-b border-borderlight pb-3">
                <span className="font-serif font-semibold text-base text-ink group-hover:text-cedar transition-colors">
                  Modul Cetak A4 Landscape
                </span>
                <span className="text-[10px] font-mono text-ink-muted px-2 py-0.5 rounded bg-subtle">
                  Majelis
                </span>
              </div>

              {/* Visual PDF Mockup Preview */}
              <div className="p-3.5 rounded-xl bg-subtle/60 border border-borderlight space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>Lembaran Siap Fotokopi</span>
                  <span className="text-cedar font-semibold">Font Amiri</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-borderlight space-y-1 text-[10px] font-mono">
                  <div className="flex items-center justify-between border-b border-borderlight pb-1">
                    <span className="font-bold text-ink truncate">Hadis Niat &bull; Shahih Bukhari</span>
                    <span className="text-ink-muted">Hal 1/2</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 pt-1 text-center text-[9px] text-ink-secondary">
                    <span className="bg-subtle p-0.5 rounded">Lafaz</span>
                    <span className="bg-subtle p-0.5 rounded">Arti</span>
                    <span className="bg-subtle p-0.5 rounded">I&apos;rab</span>
                    <span className="bg-subtle p-0.5 rounded">Wazan</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-ink-secondary leading-relaxed">
                Sekali klik untuk mengubah naskah digital menjadi dokumen PDF resmi 4 kolom berbingkai rapi,
                ideal untuk materi halaqah santri, kutubut turats, dan talaqqi pesantren.
              </p>
            </div>
          </div>

          {/* Interactive Talaqqi Studio Banner (Prestigious & Authentic) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#163324] via-[#10271B] to-[#0A1A12] text-surface border border-ochre/30 p-6 sm:p-10 shadow-float relative overflow-hidden">
            {/* Subtle background arabesque watermark */}
            <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-ochre/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3 text-left">
                <span className="text-xs font-mono text-ochre-light uppercase tracking-wider font-semibold block">
                  Studio Latihan Baca Arab Gundul
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-surface font-normal leading-snug">
                  Bimbingan Membaca Naskah Kata Demi Kata Bersama Asisten
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                  Belum lancar membaca naskah tanpa harakat? Asisten akan membimbingmu menebak kedudukan nahwu
                  dan syakal akhir dengan evaluasi kaidah instan. Kamu juga bisa latihan menggunakan naskah dari arsip kajianmu sendiri!
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/practice"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ochre hover:bg-ochre-light text-surface font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-glowOchre active:scale-95"
                  >
                    <span>Mulai Latihan Baca</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/library"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-stone-200 text-xs sm:text-sm font-medium transition text-center"
                  >
                    Buka Koleksi Arsip
                  </Link>
                </div>
              </div>

              {/* Interactive Preview Widget on the Right */}
              <div className="lg:col-span-5 bg-surface/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-3 select-none text-left">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-300 border-b border-white/10 pb-2">
                  <span>Simulasi Bimbingan</span>
                  <span className="text-emerald-400 font-semibold">Asisten Aktif</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-arabic text-2xl text-surface font-bold">
                      ذَهَبَ أَهْلُ الدُّثُورِ
                    </span>
                    <span className="text-[10px] font-mono bg-ochre/30 text-ochre-light px-2 py-0.5 rounded">
                      Kata ke-1: ذَهَبَ
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1.5 text-xs">
                    <span className="text-stone-300 block font-medium">Tebak kedudukan kata:</span>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Fi&apos;il Madhi (Mabni &apos;alal Fathi) &bull; Benar!</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-300 italic">
                    &ldquo;Tepat sekali! Kata kerja masa lampau yang mabni fathah.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}