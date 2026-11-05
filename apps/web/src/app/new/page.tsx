'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, Upload, FileText, Loader2, X } from 'lucide-react';
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

  // State untuk unggah dokumen (PDF, TXT, DOCX)
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    wordCount: number;
    method: 'direct' | 'ocr';
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(sourceText);

  // Sampel Hadis
  const samples = [
    {
      label: 'Hadis Niat (Arbain 1)',
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
    setUploadedFile(null);
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    const ext = file.name.toLowerCase().split('.').pop() || '';
    if (!['pdf', 'txt', 'docx', 'doc'].includes(ext)) {
      setError('Format file tidak didukung. Mohon gunakan PDF, TXT, atau DOCX.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Ukuran file maksimal 15MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengekstrak dokumen.');
      }

      setSourceText(data.text);
      if (!title.trim() && data.suggestedTitle) {
        setTitle(data.suggestedTitle);
      }
      setUploadedFile({
        name: file.name,
        wordCount: data.wordCount,
        method: data.method,
      });

      if (data.wordCount > 3000) {
        setError(`Teks Arab berhasil diekstrak (${data.wordCount.toLocaleString()} kata), namun melebihi batas sistem 3.000 kata. Silakan potong naskah menjadi bagian yang lebih ringkas agar tombol analisis aktif.`);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengekstrak dokumen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sourceText.trim()) {
      setError('Teks Arab wajib diisi.');
      return;
    }

    if (wordCount > 3000) {
      setError('Panjang teks melebihi batas 3.000 kata.');
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
    <div className="min-h-screen bg-canvas text-ink pb-24 sm:pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto px-5 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            Kajian Matan Baru
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
            Tempel atau ketik teks Arab gundul untuk dibedah secara kata per kata.
          </p>
        </div>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] font-mono text-ink-muted uppercase mr-1">Contoh:</span>
          {samples.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleApplySample(s)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-subtle transition active:scale-95"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-borderlight shadow-minimal space-y-6">
            {/* Title & Source */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1.5">
                  Judul Kajian
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Hadis 1 Arbain — Keutamaan Niat"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas/40 text-sm focus:border-ink focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block mb-1.5">
                  Kitab Rujukan (Opsional)
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Misal: Shahih Al-Bukhari No. 1"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas/40 text-sm focus:border-ink focus:outline-none transition"
                />
              </div>
            </div>

            {/* Document Upload Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                  Unggah Dokumen (PDF / TXT / DOCX)
                </label>
                <span className="text-[11px] font-mono text-ink-muted">Maks. 15MB</span>
              </div>

              {uploadedFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-subtle/80 border border-border text-xs">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-borderlight shrink-0 text-cedar">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-ink truncate">{uploadedFile.name}</p>
                      <p className="text-[11px] text-ink-muted">
                        {uploadedFile.wordCount.toLocaleString()} kata terekstrak{' '}
                        {uploadedFile.method === 'ocr' ? '• via OCR Vision' : '• Teks Digital'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas transition"
                    title="Ganti file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 sm:p-5 rounded-xl border border-dashed text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-ink bg-subtle/80 scale-[1.01]'
                      : 'border-border bg-canvas/30 hover:border-ink/40 hover:bg-canvas/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <Loader2 className="w-5 h-5 text-cedar animate-spin" />
                      <span className="text-xs font-medium text-ink">
                        Mengekstrak teks Arab dari dokumen...
                      </span>
                      <span className="text-[10px] text-ink-muted">Mohon tunggu beberapa saat</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                      <div className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center text-ink-secondary mb-0.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-ink font-medium">
                        Klik untuk unggah file atau tarik &amp; lepas ke sini
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        Mendukung PDF kitab/tulisan, file teks (.txt), dan Word (.docx)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arabic Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                  Matan Teks Arab
                </label>
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    wordCount > 3000 ? 'text-red-600 font-semibold' : 'text-ink-muted'
                  }`}
                >
                  {wordCount.toLocaleString()} / 3.000 kata
                </span>
              </div>

              <textarea
                rows={6}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="الصق النص العربي هنا..."
                className={`w-full p-4 rounded-xl border bg-canvas/50 font-arabic text-2xl leading-[2.4] text-right focus:border-ink focus:outline-none transition shadow-inner ${
                  wordCount > 3000 ? 'border-red-300' : 'border-border'
                }`}
                required
              />

              {wordCount > 3000 && (
                <div className="mt-2 p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>
                    Jumlah teks Arab ({wordCount.toLocaleString()} kata) melebihi batas 3.000 kata. Silakan potong naskah menjadi bab yang lebih ringkas.
                  </span>
                </div>
              )}
            </div>

            {/* Depth Mode */}
            <div className="pt-2 border-t border-borderlight flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-ink block">Format Tafshil</span>
                <span className="text-[11px] text-ink-muted">
                  I&apos;rab lengkap, wazan shorof, dan akar kata
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetail('full')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    detail === 'full'
                      ? 'bg-ink text-surface'
                      : 'bg-subtle text-ink-secondary hover:text-ink'
                  }`}
                >
                  Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => setDetail('brief')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    detail === 'brief'
                      ? 'bg-ink text-surface'
                      : 'bg-subtle text-ink-secondary hover:text-ink'
                  }`}
                >
                  Ringkas
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || uploading || !sourceText.trim() || wordCount > 3000}
                className="w-full py-3 rounded-full bg-cedar hover:bg-cedar-hover text-surface font-medium text-xs transition flex items-center justify-center gap-2 shadow-minimal disabled:opacity-40 active:scale-98"
              >
                {uploading ? (
                  <span>Mengekstrak Teks Dokumen...</span>
                ) : loading ? (
                  <span>Menyiapkan Analisis...</span>
                ) : wordCount > 3000 ? (
                  <span>Maksimal 3.000 Kata ({wordCount.toLocaleString()} kata)</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mulai Analisis Nahwu &amp; Shorof</span>
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
