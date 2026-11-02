'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Filter,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DocumentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId');

  const supabase = createClient();
  const [doc, setDoc] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Status polling job
  const [jobProgress, setJobProgress] = useState<{
    status: string;
    done: number;
    total: number;
  } | null>(null);

  // Fetch document data
  const fetchDoc = async () => {
    const { data: d } = await supabase
      .from('documents')
      .select('*, segments(*, words(*))')
      .eq('id', id)
      .single();

    if (d) {
      setDoc(d);
      const sortedSegs = (d.segments || []).sort((a: any, b: any) => a.position - b.position);
      sortedSegs.forEach((seg: any) => {
        seg.words = (seg.words || []).sort((a: any, b: any) => a.position - b.position);
      });
      setSegments(sortedSegs);

      // Jika sudah ada pdf_path, ambil signed URL untuk unduh
      if (d.pdf_path) {
        const { data: urlData } = await supabase.storage
          .from('exports')
          .createSignedUrl(d.pdf_path, 600); // 10 menit
        if (urlData?.signedUrl) {
          setDownloadUrl(urlData.signedUrl);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoc();
  }, [id]);

  // Polling job jika sedang processing
  useEffect(() => {
    if (!initialJobId && doc?.status !== 'queued' && doc?.status !== 'processing') {
      return;
    }

    const interval = setInterval(async () => {
      if (initialJobId) {
        const res = await fetch(`/api/jobs/${initialJobId}`);
        if (res.ok) {
          const j = await res.json();
          setJobProgress({
            status: j.status,
            done: j.progressDone || 0,
            total: j.progressTotal || 0,
          });

          if (j.status === 'done' || j.status === 'failed') {
            clearInterval(interval);
            fetchDoc();
          }
        }
      } else {
        fetchDoc();
        if (doc?.status === 'ready' || doc?.status === 'needs_review') {
          clearInterval(interval);
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [initialJobId, doc?.status]);

  // Edit sel kata inline
  const handleEditWord = async (wordId: string, field: string, value: string) => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.map((w: any) =>
          w.id === wordId ? { ...w, [field]: value, edited: true } : w,
        ),
      })),
    );

    await supabase
      .from('words')
      .update({ [field]: value, edited: true })
      .eq('id', wordId);
  };

  // Toggle tandai sudah dicek
  const handleToggleChecked = async (wordId: string, current: boolean) => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.map((w: any) => (w.id === wordId ? { ...w, checked: !current } : w)),
      })),
    );

    await supabase.from('words').update({ checked: !current }).eq('id', wordId);
  };

  // Ekspor PDF trigger
  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/documents/${id}/export`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      }
      fetchDoc();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgwarm flex items-center justify-center text-ink/70">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 animate-spin text-forest" />
          <span>Memuat data dokumen...</span>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-bgwarm flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-forest mb-2">Dokumen Tidak Ditemukan</h2>
        <Link href="/library" className="text-sm text-gold-dark underline">
          Kembali ke Dokumen Saya
        </Link>
      </div>
    );
  }

  const isProcessing = doc.status === 'queued' || doc.status === 'processing';

  return (
    <div className="min-h-screen bg-bgwarm text-ink pb-24">
      {/* Top Header */}
      <header className="border-b border-sand bg-surface sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="p-2 rounded-lg hover:bg-sand/60 text-ink/70 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-base text-forest leading-tight line-clamp-1">
                {doc.title}
              </h1>
              {doc.source_name && (
                <span className="text-xs text-gold-dark font-medium">{doc.source_name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download
                className="px-4 py-2 rounded-lg bg-forest hover:bg-forest-hover text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isProcessing || exporting}
                className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-light text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 transition shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>{exporting ? 'Merender...' : 'Ekspor PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Notification Bar */}
      {isProcessing && (
        <div className="bg-forest text-white py-3 px-4 shadow-inner">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 animate-spin text-gold" />
              <span>AI sedang menganalisis i&apos;rab dan shorof... Mohon tunggu sejenak.</span>
            </div>
            {jobProgress && jobProgress.total > 0 && (
              <span className="font-bold bg-forest-hover px-2.5 py-1 rounded">
                Segmen {jobProgress.done} dari {jobProgress.total}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterNeedsReview(!filterNeedsReview)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                filterNeedsReview
                  ? 'bg-alert/15 border-alert text-alert'
                  : 'bg-surface border-sand text-ink/70 hover:bg-sand'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Hanya yang perlu dicek (⚠)</span>
            </button>
          </div>

          <div className="text-xs text-ink/60">
            Total {segments.length} Segmen • Klik sel tabel untuk mengedit langsung
          </div>
        </div>

        {/* Segments List */}
        <div className="space-y-8">
          {segments.map((seg) => {
            const displayWords = filterNeedsReview
              ? seg.words.filter((w: any) => !w.checked || (w.confidence && w.confidence < 0.7))
              : seg.words;

            return (
              <div
                key={seg.id}
                className="bg-surface rounded-2xl p-6 md:p-8 border border-sand shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-sand pb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-forest text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      Segmen {seg.position}
                    </span>
                    {seg.status === 'needs_review' && (
                      <span className="text-xs font-semibold text-alert bg-alert/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Perlu Diperiksa</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Arab Bersyakal */}
                <div className="bg-bgwarm p-5 rounded-xl border-r-4 border-forest text-right">
                  <div className="font-arabic text-2xl md:text-3xl leading-loose text-ink">
                    {seg.arabic_vocalized || seg.source_text}
                  </div>
                </div>

                {/* Terjemah */}
                <div className="bg-sand/40 p-4 rounded-xl text-sm text-ink/85">
                  <strong className="text-forest text-xs uppercase tracking-wider block mb-1">
                    Terjemah
                  </strong>
                  <p>{seg.translation_id || '-'}</p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-xs md:text-sm border-collapse">
                    <thead>
                      <tr className="bg-forest text-white">
                        <th className="p-3 text-right font-arabic text-base w-[18%]">Lafaz</th>
                        <th className="p-3 text-left w-[22%]">Arti Per Kata</th>
                        <th className="p-3 text-left w-[32%]">I&apos;rab Nahwu</th>
                        <th className="p-3 text-left w-[20%]">Shorof (Wazan/Akar)</th>
                        <th className="p-3 text-center w-[8%]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand">
                      {displayWords.map((w: any) => {
                        const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                        return (
                          <tr
                            key={w.id}
                            className={`transition ${
                              needsCheck ? 'bg-alert/5 hover:bg-alert/10' : 'hover:bg-bgwarm/40'
                            }`}
                          >
                            <td className="p-3 text-right font-arabic text-lg font-bold text-forest">
                              {w.ar}
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={w.meaning_id || ''}
                                onChange={(e) => handleEditWord(w.id, 'meaning_id', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent hover:border-sand focus:border-forest focus:outline-none py-0.5"
                              />
                            </td>
                            <td className="p-3 text-ink/90">
                              <textarea
                                rows={2}
                                value={w.nahwu || ''}
                                onChange={(e) => handleEditWord(w.id, 'nahwu', e.target.value)}
                                className="w-full bg-transparent border border-transparent hover:border-sand focus:border-forest focus:outline-none p-1 rounded resize-y"
                              />
                            </td>
                            <td className="p-3 text-xs text-ink/80 space-y-1">
                              {w.sharf_wazan && (
                                <div>
                                  <span className="font-semibold text-forest">Wazan: </span>
                                  <span>{w.sharf_wazan}</span>
                                </div>
                              )}
                              {w.sharf_root && (
                                <div>
                                  <span className="font-semibold text-forest">Akar: </span>
                                  <span>{w.sharf_root}</span>
                                </div>
                              )}
                              {w.sharf_tashrif && (
                                <div className="text-ink/65 italic">{w.sharf_tashrif}</div>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleChecked(w.id, w.checked)}
                                className={`p-1.5 rounded-lg transition ${
                                  w.checked
                                    ? 'text-forest hover:bg-forest/10'
                                    : 'text-alert hover:bg-alert/10'
                                }`}
                                title={w.checked ? 'Sudah diperiksa' : 'Perlu diperiksa'}
                              >
                                {w.checked ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5" />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {displayWords.map((w: any) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-xl border border-sand bg-bgwarm/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-arabic text-xl font-bold text-forest">{w.ar}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleChecked(w.id, w.checked)}
                          className={w.checked ? 'text-forest' : 'text-alert'}
                        >
                          {w.checked ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-forest">Arti: </span>
                        <span>{w.meaning_id}</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-forest">Nahwu: </span>
                        <span>{w.nahwu || '-'}</span>
                      </div>
                      {w.sharf_wazan && (
                        <div className="text-xs text-ink/70">
                          <span className="font-semibold text-forest">Shorof: </span>
                          <span>
                            {w.sharf_wazan} ({w.sharf_root})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
