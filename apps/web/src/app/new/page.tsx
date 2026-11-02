'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, AlertCircle, FileText } from 'lucide-react';
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

  // Contoh hadis siap klik
  const sampleHadith =
    'ذهب أهل الدثور بالأجور، يصلون كما نصلي، ويصومون كما نصوم، ويتصدقون بفضول أموالهم.';

  const handleFillSample = () => {
    setTitle('Kajian Hadis Abu Dzar — Ahli Dutsur');
    setSourceName('Shahih Muslim No. 1006');
    setSourceText(sampleHadith);
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
    <div className="min-h-screen bg-bgwarm text-ink pb-20">
      {/* Header */}
      <header className="border-b border-sand bg-surface sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-forest transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
          <span className="font-bold text-sm text-forest">Analisis Dokumen Baru</span>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs text-gold-dark hover:underline font-semibold"
          >
            Isi Contoh Hadis
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-alert/10 border border-alert/30 text-alert flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Metadata Dokumen */}
          <div className="bg-surface p-6 rounded-2xl border border-sand shadow-sm space-y-4">
            <h2 className="text-base font-bold text-forest flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Informasi Kajian</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1.5">
                  Judul Kajian / Dokumen
                </label>
                <input
                  type="text"
                  placeholder="Mis: Bab Keutamaan Sedekah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand bg-bgwarm/40 text-sm focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1.5">
                  Nama Kitab / Sumber Rujukan
                </label>
                <input
                  type="text"
                  placeholder="Mis: Shahih Muslim, Bulughul Maram"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-sand bg-bgwarm/40 text-sm focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/80 mb-1.5">
                Tingkat Kedalaman Analisis
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDetail('full')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    detail === 'full'
                      ? 'border-forest bg-forest/5 text-forest font-semibold shadow-sm'
                      : 'border-sand hover:bg-bgwarm/30 text-ink/70'
                  }`}
                >
                  <div className="font-bold text-sm mb-0.5">Lengkap (Rekomendasi)</div>
                  <div>Syakal + Terjemah + I&apos;rab Nahwu + Wazan Shorof</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDetail('brief')}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    detail === 'brief'
                      ? 'border-forest bg-forest/5 text-forest font-semibold shadow-sm'
                      : 'border-sand hover:bg-bgwarm/30 text-ink/70'
                  }`}
                >
                  <div className="font-bold text-sm mb-0.5">Ringkas</div>
                  <div>Syakal + Terjemah Per Kata saja (lebih cepat)</div>
                </button>
              </div>
            </div>
          </div>

          {/* Input Teks Arab */}
          <div className="bg-surface p-6 rounded-2xl border border-sand shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-forest flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Teks Arab Gundul</span>
              </label>
              <span
                className={`text-xs font-semibold ${wordCount > 3000 ? 'text-alert' : 'text-ink/60'}`}
              >
                {wordCount} / 3.000 Kata
              </span>
            </div>

            <textarea
              dir="rtl"
              lang="ar"
              rows={8}
              placeholder="اكتب أو الصق النص العربي هنا..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full p-4 rounded-xl border border-sand bg-bgwarm/30 font-arabic text-xl md:text-2xl leading-loose focus:outline-none focus:border-forest text-right resize-y min-h-[200px]"
              required
            />

            <div className="text-xs text-ink/60 leading-relaxed bg-sand/30 p-3 rounded-lg border border-sand/50">
              💡 <strong>Catatan Integritas:</strong> Teks Anda akan diproses oleh model AI tanpa
              mengubah satu pun konsonan huruf aslinya. Hanya tanda syakal dan analisis gramatika
              yang akan ditambahkan.
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-sand text-ink/70 text-sm font-semibold hover:bg-sand transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading || !sourceText.trim() || wordCount > 3000}
              className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-hover disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-md shadow-forest/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Memulai Antrean...' : 'Proses Analisis'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
