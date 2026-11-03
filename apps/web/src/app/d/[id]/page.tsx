'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  Share2,
  Check,
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
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
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

  // Flatten all words for word-by-word reader navigation
  const allWords = segments.flatMap((s) => s.words || []);
  const currentWordIndex = selectedWord
    ? allWords.findIndex((w) => w.id === selectedWord.id)
    : -1;

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setSelectedWord(allWords[currentWordIndex - 1]);
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < allWords.length - 1) {
      setSelectedWord(allWords[currentWordIndex + 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="font-arabic text-3xl text-ink font-normal mb-2 opacity-60">ن</span>
          <p className="font-serif italic text-sm text-ink-tertiary">Membuka lembaran kajian...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
          <p className="font-serif italic text-lg text-ink mb-2">Dokumen tidak ditemukan</p>
          <Link
            href="/library"
            className="text-xs text-ink-secondary underline hover:text-ink transition"
          >
            Kembali ke arsip kajian
          </Link>
        </div>
      </div>
    );
  }

  const isProcessing = doc.status === 'queued' || doc.status === 'processing';
  const totalWords = allWords.length;

  return (
    <div className="min-h-screen bg-canvas text-ink pb-28 sm:pb-20">
      <Navbar />

      {/* Subtle Hairline Processing Indicator */}
      {isProcessing && (
        <div className="w-full h-1 bg-subtle overflow-hidden">
          <div className="h-full bg-cedar w-2/5 animate-pulse"></div>
        </div>
      )}

      {/* Document Header */}
      <header className="border-b border-borderlight bg-surface/50">
        <div className="max-w-4xl mx-auto px-5 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-ink-muted font-mono">
                <Link href="/library" className="hover:text-ink transition flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  <span>Arsip</span>
                </Link>
                <span>/</span>
                <span>{doc.source_name || 'Kajian Mandiri'}</span>
              </div>

              <h1 className="font-serif text-2xl md:text-4xl text-ink font-normal tracking-tight">
                {doc.title}
              </h1>

              <div className="flex items-center gap-3 mt-3 text-xs text-ink-tertiary">
                <span>{totalWords > 0 ? `${totalWords} Lafaz` : `${doc.word_count || 0} Kata`}</span>
                <span>•</span>
                <span>{segments.length} Fasal</span>
                {doc.status === 'needs_review' && (
                  <>
                    <span>•</span>
                    <span className="text-amber-800 font-medium">Perlu tashih</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-full border border-border text-xs text-ink-secondary hover:text-ink hover:bg-subtle transition flex items-center gap-1.5"
                title="Salin Tautan"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
              </button>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download
                  className="px-4 py-1.5 rounded-full bg-ink hover:bg-stone-800 text-surface text-xs font-medium flex items-center gap-1.5 transition shadow-minimal"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isProcessing || exporting}
                  className="px-4 py-1.5 rounded-full bg-cedar hover:bg-cedar-hover text-surface text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 transition shadow-minimal"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{exporting ? 'Merender...' : 'Ekspor PDF'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Reading Flow */}
      <main className="max-w-4xl mx-auto px-5 py-8 md:py-12">
        {/* Subtle Filter Toggle */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-borderlight">
          <span className="text-xs text-ink-muted">
            Ketuk lafaz untuk menelaah i&apos;rab dan wazan shorof.
          </span>
          <button
            type="button"
            onClick={() => setFilterNeedsReview(!filterNeedsReview)}
            className={`text-xs font-medium transition flex items-center gap-1.5 ${
              filterNeedsReview ? 'text-amber-900 font-semibold' : 'text-ink-tertiary hover:text-ink'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{filterNeedsReview ? 'Menampilkan: Perlu Tashih' : 'Saring Perlu Tashih'}</span>
          </button>
        </div>

        {/* Segments Stream */}
        <div className="space-y-16">
          {segments.map((seg, sIdx) => {
            const displayWords = filterNeedsReview
              ? seg.words.filter((w: any) => !w.checked || (w.confidence && w.confidence < 0.7))
              : seg.words;

            return (
              <section key={seg.id} className="space-y-8">
                {/* Minimal Segment Number */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-ink-muted uppercase tracking-widest">
                    Fasal {seg.position}
                  </span>
                  <div className="flex-1 h-px bg-borderlight"></div>
                </div>

                {/* The Matan Arabic Text (Pure, calm, dignified reading experience) */}
                <div className="p-6 md:p-8 rounded-2xl bg-surface border border-borderlight shadow-minimal text-right">
                  <div className="font-arabic text-2xl md:text-3xl leading-[2.6] text-ink flex flex-wrap flex-row-reverse gap-x-2 gap-y-1 items-center">
                    {(seg.words || []).map((w: any) => {
                      const isSelected = selectedWord?.id === w.id;
                      const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWord(w)}
                          className={`font-arabic transition-all px-1.5 py-0.5 rounded cursor-pointer ${
                            isSelected
                              ? 'bg-ink text-surface font-semibold scale-105 shadow-minimal'
                              : needsCheck
                                ? 'underline decoration-amber-500/60 decoration-wavy underline-offset-8 hover:bg-subtle'
                                : 'hover:bg-subtle hover:text-cedar'
                          }`}
                        >
                          {w.ar}
                        </button>
                      );
                    })}
                  </div>

                  {/* Translation in Quiet Editorial Serif */}
                  {seg.translation_id && (
                    <div className="mt-6 pt-5 border-t border-borderlight text-left">
                      <p className="font-serif italic text-base md:text-lg text-ink-secondary leading-relaxed">
                        &ldquo;{seg.translation_id}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Word-by-Word Study Stream (Minimalist, quiet, no clutter) */}
                <div className="divide-y divide-borderlight border-y border-borderlight">
                  {displayWords.map((w: any) => {
                    const isSelected = selectedWord?.id === w.id;
                    const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);

                    return (
                      <div
                        key={w.id}
                        id={`word-${w.id}`}
                        onClick={() => setSelectedWord(w)}
                        className={`py-3.5 px-3 rounded-lg transition-all cursor-pointer flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 ${
                          isSelected
                            ? 'bg-subtle ring-1 ring-border'
                            : 'hover:bg-subtle/50'
                        }`}
                      >
                        {/* Word & Meaning */}
                        <div className="flex items-baseline gap-4 sm:w-1/3">
                          <span className="font-arabic text-2xl font-bold text-ink w-20 text-right shrink-0">
                            {w.ar}
                          </span>
                          <span className="text-xs text-ink-secondary font-medium line-clamp-1">
                            {w.meaning_id || '-'}
                          </span>
                        </div>

                        {/* Nahwu & Case */}
                        <div className="flex-1 sm:px-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <NahwuBadge nahwuText={w.nahwu} />
                          </div>
                          <p className="text-xs text-ink-tertiary leading-relaxed">
                            {w.nahwu || '-'}
                          </p>
                        </div>

                        {/* Shorof & Status */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-1/4 shrink-0 text-right">
                          <div className="text-xs text-ink-muted">
                            {w.sharf_wazan && (
                              <span className="font-arabic text-sm text-ink-secondary mr-2">
                                {w.sharf_wazan}
                              </span>
                            )}
                            {w.sharf_root && (
                              <span className="text-[11px] font-mono text-ink-tertiary">
                                [{w.sharf_root}]
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChecked(w.id, w.checked);
                            }}
                            className={`p-1 rounded transition ${
                              w.checked ? 'text-ink-muted hover:text-ink' : 'text-amber-800'
                            }`}
                            title={w.checked ? 'Sudah ditashih' : 'Perlu ditashih'}
                          >
                            {w.checked ? (
                              <CheckCircle2 className="w-4 h-4 text-stone-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-700" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Minimalist Word Inspector Drawer (Mobile & Desktop) */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-ink/30 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl p-6 border border-border shadow-drawer max-h-[80vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Step Arrows */}
            <div className="flex items-center justify-between border-b border-borderlight pb-3">
              <div className="flex items-center gap-1 text-xs text-ink-tertiary font-mono">
                <button
                  type="button"
                  onClick={handlePrevWord}
                  disabled={currentWordIndex <= 0}
                  className="p-1 rounded hover:bg-subtle disabled:opacity-20 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  {currentWordIndex + 1} / {allWords.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextWord}
                  disabled={currentWordIndex >= allWords.length - 1}
                  className="p-1 rounded hover:bg-subtle disabled:opacity-20 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="p-1 rounded text-ink-muted hover:text-ink transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Big Arabic Display */}
            <div className="text-center py-2">
              <span className="font-arabic text-4xl text-ink font-bold leading-relaxed block">
                {selectedWord.ar}
              </span>
              <div className="mt-2">
                <NahwuBadge nahwuText={selectedWord.nahwu} />
              </div>
            </div>

            {/* Editable Meaning */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                Arti Kata
              </label>
              <input
                type="text"
                value={selectedWord.meaning_id || ''}
                onChange={(e) => handleEditWord(selectedWord.id, 'meaning_id', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-borderlight bg-subtle/50 text-sm focus:border-ink focus:outline-none transition"
              />
            </div>

            {/* Editable Nahwu */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                I&apos;rab Nahwu
              </label>
              <textarea
                rows={2}
                value={selectedWord.nahwu || ''}
                onChange={(e) => handleEditWord(selectedWord.id, 'nahwu', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-borderlight bg-subtle/50 text-xs leading-relaxed focus:border-ink focus:outline-none transition"
              />
            </div>

            {/* Shorof Info */}
            <div className="p-3 rounded-lg bg-subtle/70 text-xs grid grid-cols-2 gap-2 text-ink-secondary">
              <div>
                <span className="text-ink-muted block text-[10px] uppercase font-mono">Wazan</span>
                <span className="font-arabic text-sm text-ink">{selectedWord.sharf_wazan || '-'}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px] uppercase font-mono">Akar</span>
                <span className="font-mono text-xs text-ink">{selectedWord.sharf_root || '-'}</span>
              </div>
              {selectedWord.sharf_tashrif && (
                <div className="col-span-2 pt-2 border-t border-borderlight">
                  <span className="text-ink-muted block text-[10px] uppercase font-mono">Tashrif</span>
                  <span>{selectedWord.sharf_tashrif}</span>
                </div>
              )}
            </div>

            {/* Action Bottom */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => handleToggleChecked(selectedWord.id, selectedWord.checked)}
                className="text-xs font-medium text-ink-secondary hover:text-ink flex items-center gap-1.5 transition"
              >
                {selectedWord.checked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Sudah Ditashih</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Tandai Selesai</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="px-4 py-2 rounded-full bg-ink text-surface text-xs font-medium hover:bg-stone-800 transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Mobile (Clean, minimal action sheet) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-borderlight p-3 px-5 flex items-center justify-between shadow-drawer">
        <Link
          href="/library"
          className="p-2 rounded-full border border-border text-xs text-ink-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="px-5 py-2 rounded-full bg-ink text-surface text-xs font-medium flex items-center gap-1.5 shadow-minimal"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isProcessing || exporting}
              className="px-5 py-2 rounded-full bg-cedar text-surface text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 shadow-minimal"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{exporting ? 'Merender...' : 'Ekspor PDF'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
