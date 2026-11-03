'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  AlertCircle,
  FileText,
  Scroll,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { countWords } from '@pinterbacaarab/shared';

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [detail, setDetail] = useState<'full' | 'brief'>('full');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(sourceText);

  // Sampel Hadis Pilihan Siap Pakai
  const samples = [
    {
      label: 'Hadis Arbain 1 (Niat)',
      title: 'Hadis 1 Arbain — Innamal A\'malu Binniyat',
      source: 'Shahih Al-Bukhari No. 1',
      text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه.',
    },
    {
      label: 'Hadis Ahli Dutsur',
      title: 'Hadis Abu Dzar — Ahli Dutsur',
      source: 'Shahih Muslim No. 1006',
      text: 'ذهب أهل الدثور بالأجور، يصلون كما نصلي، ويصومون كما نصوم، ويتصدقون بفضول أموالهم.',
    },
    {
      label: 'Kaidah Fiqhiyyah',
      title: 'Kaidah Fiqh — Al-Yaqinu La Yazulu Bisy-Syakk',
      source: 'Al-Asybah wan Nazha-ir',
      text: 'اليقين لا يزول بالشك، والأصل بقاء ما كان على ما كان، والمشقة تجلب التيسير.',
    },
  ];

  const handleApplySample = (s: (typeof samples)[0]) => {
    setTitle(s.title);
    setSourceName(s.source);
    setSourceText(s.text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sourceText.trim()) {
      setError('Teks Arab wajib diisi.');
      return;
    }

    if (wordCount > 3000) {
      setError('Panjang teks melebihi batas 3.000 kata per dokumen.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          source_name: sourceName,
          source_text: sourceText,
          detail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses dokumen.');
      }

      router.push(`/d/${data.documentId}?jobId=${data.jobId}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment-pattern text-ink pb-24 md:pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Top Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-forest transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="font-serif font-extrabold text-2xl md:text-4xl text-forest tracking-tight">
            Analisis Matan Arab Baru
          </h1>
          <p className="text-xs md:text-sm text-ink-muted mt-1 leading-relaxed">
            Ketik atau tempel teks hadis / kutipan kitab Arab gundul. Sistem akan otomatis membedah
            I&apos;rab dan Wazan Shorof per kata.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-surface border border-sand shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest block mb-2 font-sans">
            Gunakan Contoh Hadis Cepat:
          </span>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleApplySample(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sandlight hover:bg-forest hover:text-white text-forest border border-sand transition shadow-xs active:scale-95"
              >
                📜 {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-alert/10 border border-alert/30 text-alert flex items-start gap-3 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-surface rounded-3xl p-6 md:p-8 border border-sand shadow-card space-y-6 relative overflow-hidden">
            {/* Title & Source Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                  Judul Dokumen / Nama Kajian
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Hadis 1 Arbain Nawawi — Keutamaan Niat"
                  className="w-full px-4 py-3 rounded-2xl border border-sand bg-parchment-50 text-ink placeholder:text-ink-soft/60 focus:border-forest focus:outline-none text-sm transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                  Sumber Rujukan / Kitab
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Contoh: Shahih Al-Bukhari No. 1 / Fathul Qorib"
                  className="w-full px-4 py-3 rounded-2xl border border-sand bg-parchment-50 text-ink placeholder:text-ink-soft/60 focus:border-forest focus:outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Arabic Textarea (Matan Input) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                  <span>Matan Teks Arab (Gundul / Sebagian Syakal)</span>
                  <span className="text-alert">*</span>
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    wordCount > 3000 ? 'text-alert font-bold' : 'text-ink-soft'
                  }`}
                >
                  {wordCount.toLocaleString()} / 3.000 kata
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={7}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="اكتب أو الصق النص العربي هنا بدون تشكيل..."
                  className="w-full p-5 rounded-2xl border border-sand bg-parchment-100 text-ink placeholder:text-ink-soft/40 focus:border-forest focus:outline-none font-arabic text-xl md:text-2xl leading-[2.2] transition text-right shadow-inner"
                  required
                />
              </div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                Tanda baca seperti titik, koma Arab (،), titik dua (:), dan tanda kutip akan
                dipertahankan secara akurat oleh sistem validasi konsonan.
              </p>
            </div>

            {/* Detail Mode Selection */}
            <div className="pt-2 border-t border-sand/60">
              <label className="text-xs font-bold uppercase tracking-wider text-forest block mb-3">
                Tingkat Kedalaman Kajian
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    detail === 'full'
                      ? 'bg-forest/5 border-forest shadow-card ring-1 ring-forest'
                      : 'bg-surface border-sand hover:bg-sandlight'
                  }`}
                >
                  <input
                    type="radio"
                    name="detail"
                    value="full"
                    checked={detail === 'full'}
                    onChange={() => setDetail('full')}
                    className="mt-1 text-forest focus:ring-forest"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest block">
                      Lengkap (Tafshil Pesantren)
                    </span>
                    <span className="text-xs text-ink-muted leading-relaxed block mt-0.5">
                      I&apos;rab mendalam (tanda &amp; alasan), Wazan Shorof, Akar Kata (Root), dan
                      bentuk Tashrif per lafaz.
                    </span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    detail === 'brief'
                      ? 'bg-forest/5 border-forest shadow-card ring-1 ring-forest'
                      : 'bg-surface border-sand hover:bg-sandlight'
                  }`}
                >
                  <input
                    type="radio"
                    name="detail"
                    value="brief"
                    checked={detail === 'brief'}
                    onChange={() => setDetail('brief')}
                    className="mt-1 text-forest focus:ring-forest"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest block">Ringkas (Intisari)</span>
                    <span className="text-xs text-ink-muted leading-relaxed block mt-0.5">
                      Fokus pada harakat pokok, terjemah makna kata, dan kedudukan nahwu utama.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-ink-soft hidden sm:block">
                Estimasi pemrosesan AI: ~30-60 detik per segmen
              </span>

              <button
                type="submit"
                disabled={loading || !sourceText.trim() || wordCount > 3000}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest-hover text-white font-bold transition flex items-center justify-center gap-2.5 shadow-card border border-gold/40 text-sm disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memulai Antrean AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-gold-light" />
                    <span>Mulai Analisis Nahwu-Shorof</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
