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
  Layers,
  Table as TableIcon,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Edit3,
  Check,
  Share2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import NahwuBadge from '@/components/NahwuBadge';

export default function DocumentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId');

  const [doc, setDoc] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Status polling job
  const [jobProgress, setJobProgress] = useState<{
    status: string;
    done: number;
    total: number;
  } | null>(null);

  // Fetch document data
  const fetchDoc = async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        const d = data.document;
        setDoc(d);
        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }

        const sortedSegs = (d.segments || []).sort((a: any, b: any) => a.position - b.position);
        sortedSegs.forEach((seg: any) => {
          seg.words = (seg.words || []).sort((a: any, b: any) => a.position - b.position);
        });
        setSegments(sortedSegs);
      }
    } catch (err) {
      console.error('Failed to fetch doc:', err);
    } finally {
      setLoading(false);
    }
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
        words: seg.words.map((w: any) => (w.id === wordId ? { ...w, [field]: value } : w)),
      })),
    );

    if (selectedWord && selectedWord.id === wordId) {
      setSelectedWord((prev: any) => (prev ? { ...prev, [field]: value } : null));
    }

    try {
      await fetch(`/api/words/${wordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error('Failed to update word:', err);
    }
  };

  // Toggle checklist validasi
  const handleToggleChecked = async (wordId: string, current: boolean) => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.map((w: any) => (w.id === wordId ? { ...w, checked: !current } : w)),
      })),
    );

    if (selectedWord && selectedWord.id === wordId) {
      setSelectedWord((prev: any) => (prev ? { ...prev, checked: !current } : null));
    }

    await fetch(`/api/words/${wordId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: !current }),
    });
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgwarm flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center text-forest mb-4 border border-forest/20">
            <span className="font-arabic text-3xl font-bold animate-pulse">ن</span>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gold animate-ping"></span>
          </div>
          <h3 className="font-serif font-bold text-lg text-forest mb-1">Membuka Lembaran Kajian...</h3>
          <p className="text-xs text-ink-soft max-w-xs leading-relaxed">
            Menyiapkan data i&apos;rab nahwu, wazan shorof, dan naskah bersyakal.
          </p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-bgwarm flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-alert/10 text-alert flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-xl text-forest mb-2">Dokumen Tidak Ditemukan</h2>
          <p className="text-sm text-ink-muted mb-6">
            Dokumen ini mungkin telah dihapus atau tautan tidak valid.
          </p>
          <Link
            href="/library"
            className="px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition shadow-card"
          >
            Kembali ke Koleksi Kajian
          </Link>
        </div>
      </div>
    );
  }

  const isProcessing = doc.status === 'queued' || doc.status === 'processing';
  const totalWords = segments.reduce((acc, seg) => acc + (seg.words?.length || 0), 0);

  return (
    <div className="min-h-screen bg-parchment-pattern text-ink pb-28 md:pb-20">
      <Navbar />

      {/* Hero Header Lembaran Dokumen */}
      <section className="border-b border-sand bg-surface/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-ink-soft">
                <Link
                  href="/library"
                  className="hover:text-forest transition flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Koleksi</span>
                </Link>
                <span>/</span>
                <span className="text-forest font-semibold">Lembar Kajian</span>
              </div>

              <h1 className="font-serif font-bold text-xl md:text-3xl text-forest tracking-tight">
                {doc.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs text-ink-muted">
                {doc.source_name && (
                  <span className="font-medium px-2.5 py-0.5 rounded-md bg-sand text-ink-muted border border-gold/30">
                    📖 {doc.source_name}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-md bg-sandlight border border-sand font-medium">
                  {totalWords > 0 ? `${totalWords} Lafaz` : `${doc.word_count || 0} Kata`}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-sandlight border border-sand font-medium">
                  {segments.length} Segmen
                </span>
                {doc.status === 'ready' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Siap Dikaji</span>
                  </span>
                )}
                {doc.status === 'needs_review' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Perlu Tashih</span>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-sand bg-surface hover:bg-sand/40 text-ink-muted hover:text-forest transition"
                title="Salin Tautan"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download
                  className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs font-semibold flex items-center gap-2 shadow-card border border-gold/40 transition active:scale-95"
                >
                  <Download className="w-4 h-4 text-gold-light" />
                  <span>Unduh PDF Kajian</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isProcessing || exporting}
                  className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-forest-900 font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition shadow-card border border-gold-dark/20 active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>{exporting ? 'Merender PDF...' : 'Ekspor PDF Siap Cetak'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Notification Bar Saat AI Bekerja */}
      {isProcessing && (
        <div className="bg-forest text-white py-3.5 px-4 shadow-inner border-y border-gold/30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
            <div className="flex items-center gap-2.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping"></span>
              <Sparkles className="w-4 h-4 text-gold-light animate-spin" />
              <span>
                Khadim AI sedang membedah i&apos;rab dan wazan shorof... Harap ditunggu sejenak.
              </span>
            </div>
            {jobProgress && jobProgress.total > 0 && (
              <div className="flex items-center gap-2 font-semibold bg-forest-hover px-3 py-1 rounded-lg border border-gold/20 text-xs">
                <span>Progres: Segmen {jobProgress.done} dari {jobProgress.total}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Controls & Mode Switcher Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface/80 backdrop-blur p-2.5 rounded-2xl border border-sand shadow-card">
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl bg-sandlight p-1 border border-sand">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'cards'
                    ? 'bg-forest text-white shadow-sm'
                    : 'text-ink-muted hover:text-forest'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kartu Kata</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === 'table'
                    ? 'bg-forest text-white shadow-sm'
                    : 'text-ink-muted hover:text-forest'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabel Kitab</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setFilterNeedsReview(!filterNeedsReview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                filterNeedsReview
                  ? 'bg-alert/10 border-alert/30 text-alert'
                  : 'bg-surface border-sand text-ink-muted hover:bg-sand/40'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Hanya Perlu Cek (⚠)</span>
            </button>
          </div>

          <div className="text-xs text-ink-soft hidden sm:block">
            💡 Tips: Ketuk lafaz Arab untuk membuka bedah detail nahwu-shorof kata.
          </div>
        </div>

        {/* Segments Stream */}
        <div className="space-y-8 md:space-y-10">
          {segments.map((seg, sIdx) => {
            const displayWords = filterNeedsReview
              ? seg.words.filter((w: any) => !w.checked || (w.confidence && w.confidence < 0.7))
              : seg.words;

            return (
              <article
                key={seg.id}
                className="bg-surface rounded-3xl p-5 md:p-8 border border-sand shadow-card space-y-6 relative overflow-hidden"
              >
                {/* Decorative Islamic Corner Border Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-40">
                  <div className="w-full h-full border-t-2 border-r-2 border-gold rounded-tr-3xl"></div>
                </div>

                {/* Segment Header */}
                <div className="flex items-center justify-between border-b border-sand pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-forest text-gold-light text-xs font-serif font-bold flex items-center justify-center border border-gold/30">
                      {seg.position}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-forest uppercase tracking-wider">
                      Fasal / Segmen Ke-{seg.position}
                    </h3>
                  </div>

                  {seg.status === 'needs_review' && (
                    <span className="text-[11px] font-semibold text-alert bg-alert/10 border border-alert/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Butuh Verifikasi</span>
                    </span>
                  )}
                </div>

                {/* Interactive Arab Bersyakal (Matan Reader) */}
                <div className="bg-parchment-100 p-5 md:p-7 rounded-2xl border border-sand/80 shadow-inner text-right">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gold-dark mb-2 font-sans">
                    Matan Bersyakal Lengkap (Ketuk kata untuk membedah)
                  </div>

                  <div className="font-arabic text-2xl md:text-3xl leading-[2.3] text-ink select-text flex flex-wrap flex-row-reverse gap-x-2 gap-y-3 items-center">
                    {(seg.words || []).map((w: any) => {
                      const isSelected = selectedWord?.id === w.id;
                      const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWord(w)}
                          className={`font-arabic transition-all px-2 py-0.5 rounded-xl border ${
                            isSelected
                              ? 'bg-forest text-gold-light border-gold shadow-gold scale-105 font-bold z-10'
                              : needsCheck
                                ? 'bg-alert/10 text-alert border-alert/30 hover:bg-alert/20'
                                : 'bg-surface/80 hover:bg-gold/20 text-ink border-sand/60 hover:border-gold/40'
                          }`}
                        >
                          {w.ar}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terjemah Indonesia */}
                <div className="bg-sandlight p-4 md:p-5 rounded-2xl border border-sand text-ink text-sm md:text-base leading-relaxed">
                  <strong className="text-[11px] font-bold uppercase tracking-wider text-forest block mb-1">
                    Terjemah Makna Fasal
                  </strong>
                  <p className="text-ink-muted">
                    {seg.translation_id || 'Sedang menerjemahkan teks...'}
                  </p>
                </div>

                {/* View Mode 1: Kartu Kata Interaktif (Mobile & Desktop Friendly) */}
                {viewMode === 'cards' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {displayWords.map((w: any) => {
                      const isSelected = selectedWord?.id === w.id;
                      const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                      return (
                        <div
                          key={w.id}
                          onClick={() => setSelectedWord(w)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? 'bg-forest/5 border-gold shadow-card ring-1 ring-gold'
                              : needsCheck
                                ? 'bg-alert/5 border-alert/30 hover:border-alert/50'
                                : 'bg-surface border-sand hover:border-forest/30 hover:shadow-card'
                          }`}
                        >
                          {/* Top Row: Arabic & Verified Check */}
                          <div className="flex items-center justify-between border-b border-sand/50 pb-2.5">
                            <span className="font-arabic text-2xl font-bold text-forest leading-relaxed">
                              {w.ar}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleChecked(w.id, w.checked);
                              }}
                              className={`p-1.5 rounded-lg transition ${
                                w.checked
                                  ? 'text-forest hover:bg-forest/10'
                                  : 'text-alert hover:bg-alert/10'
                              }`}
                              title={w.checked ? 'Terverifikasi' : 'Perlu ditashih'}
                            >
                              {w.checked ? (
                                <CheckCircle2 className="w-5 h-5 text-forest" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-alert" />
                              )}
                            </button>
                          </div>

                          {/* Meaning & Nahwu Badges */}
                          <div className="space-y-1.5">
                            <div className="text-xs font-semibold text-ink flex items-baseline gap-1.5">
                              <span className="text-[10px] uppercase font-bold text-forest/70">
                                Arti:
                              </span>
                              <span className="text-ink-muted line-clamp-1">{w.meaning_id}</span>
                            </div>

                            <div className="pt-1">
                              <NahwuBadge nahwuText={w.nahwu} />
                            </div>

                            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed pt-1">
                              {w.nahwu || '-'}
                            </p>
                          </div>

                          {/* Shorof Info Footer */}
                          {(w.sharf_wazan || w.sharf_root) && (
                            <div className="pt-2 border-t border-sand/40 flex items-center justify-between text-[11px] text-ink-soft">
                              {w.sharf_wazan && (
                                <span>
                                  <strong className="text-forest">Wazan:</strong> {w.sharf_wazan}
                                </span>
                              )}
                              {w.sharf_root && (
                                <span>
                                  <strong className="text-forest">Akar:</strong> {w.sharf_root}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* View Mode 2: Tabel Kitab Klasik (Scrollable with Sticky Lafadz) */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto rounded-2xl border border-sand">
                    <table className="w-full text-xs md:text-sm border-collapse bg-surface">
                      <thead>
                        <tr className="bg-forest text-white font-serif">
                          <th className="p-3 text-right font-arabic text-base w-[16%] sticky right-0 bg-forest z-20">
                            Lafaz
                          </th>
                          <th className="p-3 text-left w-[20%]">Arti Per Kata</th>
                          <th className="p-3 text-left w-[36%]">I&apos;rab Nahwu</th>
                          <th className="p-3 text-left w-[20%]">Shorof (Wazan/Akar)</th>
                          <th className="p-3 text-center w-[8%]">Tashih</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand">
                        {displayWords.map((w: any) => {
                          const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                          return (
                            <tr
                              key={w.id}
                              className={`transition ${
                                needsCheck ? 'bg-alert/5 hover:bg-alert/10' : 'hover:bg-sandlight/60'
                              }`}
                            >
                              <td className="p-3 text-right font-arabic text-xl font-bold text-forest sticky right-0 bg-surface z-10 border-l border-sand">
                                {w.ar}
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={w.meaning_id || ''}
                                  onChange={(e) => handleEditWord(w.id, 'meaning_id', e.target.value)}
                                  className="w-full bg-transparent border-b border-transparent hover:border-sand focus:border-forest focus:outline-none py-1 text-xs md:text-sm"
                                />
                              </td>
                              <td className="p-3 space-y-1">
                                <NahwuBadge nahwuText={w.nahwu} />
                                <textarea
                                  rows={2}
                                  value={w.nahwu || ''}
                                  onChange={(e) => handleEditWord(w.id, 'nahwu', e.target.value)}
                                  className="w-full bg-transparent border border-transparent hover:border-sand focus:border-forest focus:outline-none p-1.5 rounded-lg text-xs md:text-sm resize-y"
                                />
                              </td>
                              <td className="p-3 text-xs text-ink-muted space-y-1">
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
                                  <div className="text-ink-soft italic">{w.sharf_tashrif}</div>
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
                                  title={w.checked ? 'Terverifikasi' : 'Perlu ditashih'}
                                >
                                  {w.checked ? (
                                    <CheckCircle2 className="w-5 h-5 text-forest" />
                                  ) : (
                                    <AlertTriangle className="w-5 h-5 text-alert" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>

      {/* Slide-over Word Detail Sheet / Modal (Responsive Mobile Inspector) */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full sm:max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl p-6 border border-sand shadow-2xl max-h-[85vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest/70 font-sans">
                Kajian Tafshil Kata
              </span>
              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-sand transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Arabic Display */}
            <div className="text-center py-4 bg-parchment-100 rounded-2xl border border-sand">
              <span className="font-arabic text-4xl md:text-5xl font-bold text-forest leading-loose block">
                {selectedWord.ar}
              </span>
              <div className="mt-2">
                <NahwuBadge nahwuText={selectedWord.nahwu} />
              </div>
            </div>

            {/* Editable Meaning */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                Arti / Terjemah Lafaz
              </label>
              <input
                type="text"
                value={selectedWord.meaning_id || ''}
                onChange={(e) =>
                  handleEditWord(selectedWord.id, 'meaning_id', e.target.value)
                }
                className="w-full p-2.5 rounded-xl border border-sand bg-sandlight/40 focus:border-forest focus:outline-none text-sm font-medium"
              />
            </div>

            {/* Editable Nahwu Explanation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                I&apos;rab & Kedudukan Nahwu
              </label>
              <textarea
                rows={3}
                value={selectedWord.nahwu || ''}
                onChange={(e) =>
                  handleEditWord(selectedWord.id, 'nahwu', e.target.value)
                }
                className="w-full p-2.5 rounded-xl border border-sand bg-sandlight/40 focus:border-forest focus:outline-none text-sm leading-relaxed"
              />
            </div>

            {/* Shorof Breakdown Grid */}
            <div className="p-3.5 rounded-2xl bg-sandlight/60 border border-sand grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-ink-soft block mb-0.5">Wazan Shorof</span>
                <span className="font-bold text-forest text-sm font-arabic">
                  {selectedWord.sharf_wazan || '-'}
                </span>
              </div>
              <div>
                <span className="text-ink-soft block mb-0.5">Akar Kata (Root)</span>
                <span className="font-bold text-forest text-sm font-arabic">
                  {selectedWord.sharf_root || '-'}
                </span>
              </div>
              {selectedWord.sharf_tashrif && (
                <div className="col-span-2 pt-2 border-t border-sand/50">
                  <span className="text-ink-soft block mb-0.5">Tashrif / Shighah</span>
                  <span className="font-medium text-ink-muted">
                    {selectedWord.sharf_tashrif}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons in Sheet */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() =>
                  handleToggleChecked(selectedWord.id, selectedWord.checked)
                }
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  selectedWord.checked
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-alert/10 text-alert border border-alert/30'
                }`}
              >
                {selectedWord.checked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Sudah Ditashih</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-alert" />
                    <span>Tandai Selesai Cek</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs font-bold transition shadow-card"
              >
                Tutup Lembar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Mobile (HP Viewport Friendly) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-sand p-3 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <Link
            href="/library"
            className="p-2.5 rounded-xl border border-sand bg-surface text-ink-muted"
            title="Koleksi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setFilterNeedsReview(!filterNeedsReview)}
            className={`p-2.5 rounded-xl border text-xs font-semibold ${
              filterNeedsReview
                ? 'bg-alert/10 border-alert text-alert'
                : 'bg-surface border-sand text-ink-muted'
            }`}
            title="Filter Perlu Cek"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-bold flex items-center gap-1.5 shadow-card"
            >
              <Download className="w-4 h-4 text-gold-light" />
              <span>Unduh PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isProcessing || exporting}
              className="px-4 py-2.5 rounded-xl bg-gold text-forest-900 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-card"
            >
              <FileText className="w-4 h-4" />
              <span>{exporting ? 'Merender...' : 'Ekspor PDF'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
