'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { stripHarakat } from '@pinterbacaarab/shared';
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
  Search,
  SlidersHorizontal,
  Eye,
  Columns,
  Grid,
  BookOpen,
  Loader2,
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
  const [selectedWord, setSelectedWord] = useState<any | null>(null);
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [searchWordQuery, setSearchWordQuery] = useState('');
  const [showHarakat, setShowHarakat] = useState(true);
  const [displayMode, setDisplayMode] = useState<'split' | 'table' | 'cards'>('split');
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

        // Auto select first word of first segment if none selected
        if (!selectedWord && sortedSegs.length > 0 && sortedSegs[0].words?.length > 0) {
          setSelectedWord(sortedSegs[0].words[0]);
        }
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

  // Ekspor PDF trigger dengan setting showHarakat
  const handleExportPdf = async () => {
    setExporting(true);
    setDownloadUrl(null);
    try {
      const res = await fetch(`/api/documents/${id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showHarakat }),
      });
      const data = await res.json();
      if (data.jobId) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const jRes = await fetch(`/api/jobs/${data.jobId}`);
          if (jRes.ok) {
            const j = await jRes.json();
            if (j.status === 'done') {
              clearInterval(interval);
              setExporting(false);
              await fetchDoc();
            } else if (j.status === 'failed' || attempts > 30) {
              clearInterval(interval);
              setExporting(false);
              alert('Gagal mengekspor PDF atau waktu proses habis.');
            }
          }
        }, 1500);
      } else {
        setExporting(false);
        await fetchDoc();
      }
    } catch (err) {
      console.error(err);
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

  // Seluruh kata dari naskah secara utuh tanpa fragmentasi fasal
  const allWords = segments.flatMap((s) => s.words || []);

  const filteredWords = allWords.filter((w: any) => {
    if (filterNeedsReview && w.checked && (w.confidence === null || w.confidence >= 0.7)) {
      return false;
    }
    if (searchWordQuery.trim()) {
      const q = searchWordQuery.toLowerCase();
      const matchAr = w.ar?.includes(q);
      const matchMeaning = w.meaning_id?.toLowerCase().includes(q);
      const matchNahwu = w.nahwu?.toLowerCase().includes(q);
      const matchWazan = w.sharf_wazan?.toLowerCase().includes(q);
      const matchRoot = w.sharf_root?.toLowerCase().includes(q);
      return matchAr || matchMeaning || matchNahwu || matchWazan || matchRoot;
    }
    return true;
  });

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

  const isProcessing = doc?.status === 'queued' || doc?.status === 'processing';
  const totalVerified = allWords.filter((w) => w.checked).length;
  const totalNeedsCheck = allWords.filter((w) => !w.checked || (w.confidence && w.confidence < 0.7)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="font-arabic text-3xl text-ink font-normal mb-2 opacity-50">ن</span>
          <p className="text-xs font-mono text-ink-muted">Memuat lembaran kajian...</p>
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

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col pb-24 sm:pb-12">
      <Navbar />

      {/* Processing Hairline Indicator */}
      {isProcessing && (
        <div className="w-full h-1 bg-subtle overflow-hidden">
          <div className="h-full bg-cedar w-2/5 animate-pulse"></div>
        </div>
      )}

      {/* Workbench Header: App Proportions, Clear Metrics */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Metadata */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
                <Link href="/library" className="hover:text-ink transition flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Koleksi</span>
                </Link>
                <span>/</span>
                <span>{doc.source_name || 'Kajian Mandiri'}</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl text-ink font-medium tracking-tight">
                {doc.title}
              </h1>
            </div>

            {/* Metrics Bar (Tabular Numbers, Unslopt Craft) */}
            <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto text-xs">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-ink-muted tracking-wider">Total Lafaz</span>
                <span className="font-mono font-semibold text-ink text-sm sm:text-base tabular-nums">
                  {allWords.length}
                </span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-ink-muted tracking-wider">Ditashih</span>
                <span className="font-mono font-semibold text-emerald-800 text-sm sm:text-base tabular-nums">
                  {totalVerified}/{allWords.length}
                </span>
              </div>
              {totalNeedsCheck > 0 && (
                <>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase text-amber-800 tracking-wider">Perlu Cek</span>
                    <span className="font-mono font-semibold text-amber-800 text-sm sm:text-base tabular-nums">
                      {totalNeedsCheck}
                    </span>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pl-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-border text-ink-secondary hover:text-ink hover:bg-subtle transition"
                  title="Salin Tautan"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-800" /> : <Share2 className="w-4 h-4" />}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-surface text-xs font-medium flex items-center gap-1.5 transition shadow-minimal"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isProcessing || exporting}
                  className="px-3.5 py-2 rounded-lg bg-ink hover:bg-stone-800 text-surface text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 transition shadow-minimal"
                  title="Ekspor PDF A4 siap cetak dengan pengaturan syakal saat ini"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Merender...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>{downloadUrl ? 'Ekspor Ulang' : 'Ekspor PDF'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-toolbar: Search & View Mode Toggle */}
      <section className="border-b border-border bg-subtle/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Document Scope Indicator */}
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-xs text-ink-secondary">
              Naskah Lengkap
            </span>
            <span className="text-ink-muted text-[10px]">•</span>
            <span className="font-mono text-[11px] text-ink-muted">
              {filteredWords.length} dari {allWords.length} lafaz
            </span>
          </div>

          {/* Right Toolbar: View Mode, Harakat Toggle & Search */}
          <div className="flex items-center gap-2.5">
            {/* Toggle Syakal / Harakat */}
            <button
              type="button"
              onClick={() => setShowHarakat(!showHarakat)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition flex items-center gap-1.5 ${
                showHarakat
                  ? 'bg-surface border-border text-ink hover:border-ink/60'
                  : 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
              }`}
              title={showHarakat ? 'Sembunyikan Harakat (Teks Gundul)' : 'Tampilkan Harakat (Teks Bersyakal)'}
            >
              <span className="font-arabic text-sm leading-none">{showHarakat ? 'َـ' : 'ـ'}</span>
              <span>{showHarakat ? 'Harakat: Ada' : 'Harakat: Gundul'}</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3 h-3 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchWordQuery}
                onChange={(e) => setSearchWordQuery(e.target.value)}
                placeholder="Cari lafaz / arti / wazan..."
                className="pl-7 pr-3 py-1 rounded-md border border-border bg-surface text-xs focus:border-ink focus:outline-none w-36 sm:w-48 transition"
              />
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setFilterNeedsReview(!filterNeedsReview)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition flex items-center gap-1 ${
                filterNeedsReview
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-surface border-border text-ink-secondary hover:text-ink'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span className="hidden sm:inline">Perlu Cek</span>
            </button>

            {/* View Mode Switcher */}
            <div className="hidden sm:inline-flex rounded-md border border-border bg-surface p-0.5">
              <button
                type="button"
                onClick={() => setDisplayMode('split')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition flex items-center gap-1 ${
                  displayMode === 'split' ? 'bg-subtle text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
                title="Tampilan Studio (Matan & Panel Bedah)"
              >
                <Columns className="w-3 h-3" />
                <span>Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('table')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition flex items-center gap-1 ${
                  displayMode === 'table' ? 'bg-subtle text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
                title="Tabel Kajian Lengkap"
              >
                <FileText className="w-3 h-3" />
                <span>Tabel</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('cards')}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition flex items-center gap-1 ${
                  displayMode === 'cards' ? 'bg-subtle text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
                title="Grid Kartu Kata"
              >
                <Grid className="w-3 h-3" />
                <span>Kartu</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stage: Asymmetric Split / Real App Proportions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {displayMode === 'split' ? (
          /* Mode Studio: Matan Sentence on Left + Interactive Word Inspector on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Matan Arabic Reading Box + Word Stream */}
            <div className="lg:col-span-7 space-y-6">
              {/* Matan Naskah Lengkap (Continuous Flow) */}
              <div className="p-6 sm:p-8 rounded-xl bg-surface border border-border shadow-minimal text-right space-y-6">
                <div className="flex items-center justify-between border-b border-borderlight pb-3 text-xs font-mono text-ink-muted">
                  <span className="uppercase tracking-wider">
                    {showHarakat ? 'Naskah Matan Bersyakal' : 'Naskah Matan Gundul'}
                  </span>
                  <span>{allWords.length} Lafaz</span>
                </div>

                {/* Big Arabic Continuous Flow: dir="rtl" with inline-block words for natural right-to-left layout */}
                <div
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-2xl sm:text-3xl lg:text-4xl leading-[2.6] sm:leading-[2.8] text-ink text-right space-y-6"
                >
                  {segments.map((seg, sIdx) => {
                    const segWords = seg.words || [];
                    return (
                      <div key={seg.id || sIdx} className="space-y-3">
                        <div className="leading-[2.6] sm:leading-[2.8]">
                          {segWords.map((w: any) => {
                            const isSelected = selectedWord?.id === w.id;
                            const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);
                            const displayAr = showHarakat ? w.ar : stripHarakat(w.ar);

                            return (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => setSelectedWord(w)}
                                className={`inline-block mx-1 my-1 font-arabic transition-all px-2.5 py-0.5 rounded-lg cursor-pointer ${
                                  isSelected
                                    ? 'bg-ink text-surface font-bold scale-105 shadow-minimal'
                                    : needsCheck
                                      ? 'bg-amber-50 text-amber-900 underline decoration-amber-500/80 decoration-wavy underline-offset-8 hover:bg-amber-100'
                                      : 'hover:bg-subtle hover:text-cedar'
                                }`}
                              >
                                {displayAr}
                              </button>
                            );
                          })}
                        </div>

                        {/* Terjemah Makna per Paragraf */}
                        {seg.translation_id && (
                          <div dir="ltr" className="pt-2 pb-1 border-t border-borderlight/60 text-left">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block mb-0.5">
                              Terjemah Makna:
                            </span>
                            <p className="font-serif italic text-xs sm:text-sm text-ink-secondary leading-relaxed">
                              &ldquo;{seg.translation_id}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Word List for Active Segment */}
              <div className="bg-surface rounded-xl border border-border divide-y divide-borderlight shadow-minimal overflow-hidden">
                <div className="px-4 py-2.5 bg-subtle/50 text-xs font-mono text-ink-muted flex items-center justify-between">
                  <span>Daftar Lafaz &amp; I&apos;rab</span>
                  <span>{filteredWords.length} kata</span>
                </div>

                {filteredWords.map((w: any) => {
                  const isSelected = selectedWord?.id === w.id;
                  const needsCheck = !w.checked || (w.confidence && w.confidence < 0.7);
                  const displayAr = showHarakat ? w.ar : stripHarakat(w.ar);

                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWord(w)}
                      className={`p-3.5 sm:px-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 ${
                        isSelected ? 'bg-subtle ring-1 ring-border' : 'hover:bg-subtle/40'
                      }`}
                    >
                      <div className="flex items-baseline gap-3 sm:w-1/3">
                        <span className="font-arabic text-2xl font-bold text-ink w-20 text-right shrink-0">
                          {displayAr}
                        </span>
                        <span className="text-xs text-ink-secondary font-medium line-clamp-1">
                          {w.meaning_id || '-'}
                        </span>
                      </div>

                      <div className="flex-1 sm:px-3 space-y-1">
                        <NahwuBadge nahwuText={w.nahwu} />
                        <p className="text-xs text-ink-tertiary leading-relaxed line-clamp-1">
                          {w.nahwu || '-'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-1/4 shrink-0 text-right">
                        <div className="text-xs text-ink-muted">
                          {w.sharf_wazan && (
                            <span className="font-arabic text-sm text-ink-secondary mr-1">
                              {w.sharf_wazan}
                            </span>
                          )}
                          {w.sharf_root && (
                            <span className="text-[10px] font-mono text-ink-tertiary">
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
                          className="p-1 rounded text-ink-muted hover:text-ink transition"
                          title={w.checked ? 'Sudah ditashih' : 'Perlu ditashih'}
                        >
                          {w.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-700" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Columns: Dedicated Word Inspector Panel (Sticky Desktop) */}
            <div className="lg:col-span-5 sticky top-20 hidden lg:block">
              {selectedWord ? (
                <div className="bg-surface rounded-xl border border-border p-6 shadow-minimal space-y-5">
                  {/* Top Bar with Step Controls */}
                  <div className="flex items-center justify-between border-b border-borderlight pb-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      Bedah Tafshil Lafaz
                    </span>

                    <div className="flex items-center gap-1 font-mono text-xs text-ink-muted">
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
                  </div>

                  {/* Word Big Display */}
                  <div className="text-center py-3 bg-subtle/40 rounded-lg">
                    <span className="font-arabic text-4xl text-ink font-bold leading-relaxed block">
                      {showHarakat ? selectedWord.ar : stripHarakat(selectedWord.ar)}
                    </span>
                    <div className="mt-2">
                      <NahwuBadge nahwuText={selectedWord.nahwu} />
                    </div>
                  </div>

                  {/* Meaning Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">
                      Terjemah Arti
                    </label>
                    <input
                      type="text"
                      value={selectedWord.meaning_id || ''}
                      onChange={(e) => handleEditWord(selectedWord.id, 'meaning_id', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-canvas/40 text-xs focus:border-ink focus:outline-none transition font-medium"
                    />
                  </div>

                  {/* Nahwu Syntax Explanation */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">
                      I&apos;rab &amp; Kedudukan Nahwu
                    </label>
                    <textarea
                      rows={3}
                      value={selectedWord.nahwu || ''}
                      onChange={(e) => handleEditWord(selectedWord.id, 'nahwu', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-canvas/40 text-xs leading-relaxed focus:border-ink focus:outline-none transition resize-y"
                    />
                  </div>

                  {/* Shorof Grid */}
                  <div className="p-3.5 rounded-lg bg-subtle/60 border border-borderlight grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-mono mb-0.5">Wazan</span>
                      <span className="font-arabic text-base text-ink font-semibold">
                        {selectedWord.sharf_wazan || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-mono mb-0.5">Akar Kata (Root)</span>
                      <span className="font-mono text-xs font-semibold text-ink">
                        {selectedWord.sharf_root || '-'}
                      </span>
                    </div>
                    {selectedWord.sharf_tashrif && (
                      <div className="col-span-2 pt-2 border-t border-borderlight">
                        <span className="text-ink-muted block text-[10px] uppercase font-mono mb-0.5">Bentuk Tashrif</span>
                        <span className="text-xs text-ink-secondary">{selectedWord.sharf_tashrif}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-borderlight text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleChecked(selectedWord.id, selectedWord.checked)}
                      className="flex items-center gap-1.5 font-medium transition text-ink-secondary hover:text-ink"
                    >
                      {selectedWord.checked ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          <span>Status: Ditashih</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-700" />
                          <span>Tandai Selesai Tashih</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] font-mono text-ink-muted">
                      Posisi #{selectedWord.position}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-ink-muted space-y-2">
                  <p>Ketuk salah satu kata Arab di sebelah kiri untuk melihat rincian I&apos;rab dan Wazan Shorof.</p>
                </div>
              )}
            </div>
          </div>
        ) : displayMode === 'table' ? (
          /* Mode Table: Full Width Comprehensive Study Table */
          <div className="bg-surface rounded-xl border border-border shadow-minimal overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-subtle/80 text-ink-secondary border-b border-border font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-3 text-right font-arabic text-sm w-[15%] sticky right-0 bg-subtle z-10">Lafaz</th>
                  <th className="p-3 text-left w-[20%]">Terjemah Arti</th>
                  <th className="p-3 text-left w-[35%]">I&apos;rab &amp; Kedudukan Nahwu</th>
                  <th className="p-3 text-left w-[20%]">Morfologi Shorof</th>
                  <th className="p-3 text-center w-[10%]">Tashih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderlight">
                {filteredWords.map((w: any) => (
                  <tr key={w.id} className="hover:bg-subtle/40 transition">
                    <td className="p-3 text-right font-arabic text-2xl font-bold text-ink sticky right-0 bg-surface z-10 border-l border-borderlight">
                      {showHarakat ? w.ar : stripHarakat(w.ar)}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={w.meaning_id || ''}
                        onChange={(e) => handleEditWord(w.id, 'meaning_id', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-ink focus:outline-none py-1 text-xs"
                      />
                    </td>
                    <td className="p-3 space-y-1">
                      <NahwuBadge nahwuText={w.nahwu} />
                      <textarea
                        rows={2}
                        value={w.nahwu || ''}
                        onChange={(e) => handleEditWord(w.id, 'nahwu', e.target.value)}
                        className="w-full bg-transparent border border-transparent hover:border-border focus:border-ink focus:outline-none p-1 rounded text-xs resize-y"
                      />
                    </td>
                    <td className="p-3 text-xs text-ink-muted space-y-0.5">
                      {w.sharf_wazan && (
                        <div>
                          <span className="font-mono text-ink-muted">Wazan: </span>
                          <span className="font-arabic text-sm text-ink font-semibold">{w.sharf_wazan}</span>
                        </div>
                      )}
                      {w.sharf_root && (
                        <div>
                          <span className="font-mono text-ink-muted">Akar: </span>
                          <span className="font-mono text-ink">{w.sharf_root}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleChecked(w.id, w.checked)}
                        className="p-1 rounded text-ink-muted hover:text-ink transition"
                      >
                        {w.checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-700" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Mode Cards: Clean Grid of Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((w: any) => (
              <div
                key={w.id}
                onClick={() => setSelectedWord(w)}
                className="p-4 rounded-xl bg-surface border border-border hover:border-ink/40 transition shadow-minimal flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="flex items-center justify-between border-b border-borderlight pb-2">
                  <span className="font-arabic text-3xl font-bold text-ink">
                    {showHarakat ? w.ar : stripHarakat(w.ar)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleChecked(w.id, w.checked);
                    }}
                    className="p-1 text-ink-muted hover:text-ink"
                  >
                    {w.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-ink block">{w.meaning_id || '-'}</span>
                  <NahwuBadge nahwuText={w.nahwu} />
                  <p className="text-xs text-ink-tertiary line-clamp-2 leading-relaxed">{w.nahwu}</p>
                </div>

                {(w.sharf_wazan || w.sharf_root) && (
                  <div className="pt-2 border-t border-borderlight flex items-center justify-between text-xs text-ink-muted font-mono">
                    <span>{w.sharf_wazan}</span>
                    <span>[{w.sharf_root}]</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Word Inspector Drawer (Slide-over for HP Viewport) */}
      {selectedWord && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center p-0 bg-ink/40 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full bg-surface rounded-t-2xl p-5 border-t border-border shadow-drawer max-h-[82vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-borderlight pb-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
                <button
                  type="button"
                  onClick={handlePrevWord}
                  disabled={currentWordIndex <= 0}
                  className="p-1 rounded hover:bg-subtle disabled:opacity-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>{currentWordIndex + 1} / {allWords.length}</span>
                <button
                  type="button"
                  onClick={handleNextWord}
                  disabled={currentWordIndex >= allWords.length - 1}
                  className="p-1 rounded hover:bg-subtle disabled:opacity-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="p-1 text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Word Centerpiece */}
            <div className="text-center py-2 bg-subtle/50 rounded-lg">
              <span className="font-arabic text-4xl text-ink font-bold leading-relaxed block">
                {showHarakat ? selectedWord.ar : stripHarakat(selectedWord.ar)}
              </span>
              <div className="mt-1">
                <NahwuBadge nahwuText={selectedWord.nahwu} />
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-ink-muted block mb-1">Arti Kata</label>
                <input
                  type="text"
                  value={selectedWord.meaning_id || ''}
                  onChange={(e) => handleEditWord(selectedWord.id, 'meaning_id', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-canvas/40 text-xs focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-ink-muted block mb-1">I&apos;rab Nahwu</label>
                <textarea
                  rows={2}
                  value={selectedWord.nahwu || ''}
                  onChange={(e) => handleEditWord(selectedWord.id, 'nahwu', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-canvas/40 text-xs leading-relaxed focus:border-ink focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-subtle/70 text-xs grid grid-cols-2 gap-2 text-ink-secondary">
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase font-mono">Wazan</span>
                  <span className="font-arabic text-sm text-ink font-semibold">{selectedWord.sharf_wazan || '-'}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase font-mono">Akar</span>
                  <span className="font-mono text-xs text-ink font-semibold">{selectedWord.sharf_root || '-'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleToggleChecked(selectedWord.id, selectedWord.checked)}
                className="text-xs font-medium text-ink-secondary flex items-center gap-1.5"
              >
                {selectedWord.checked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Sudah Ditashih</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Tandai Ditashih</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className="px-4 py-1.5 rounded-full bg-ink text-surface text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border p-3 px-4 flex items-center justify-between shadow-drawer">
        <Link
          href="/library"
          className="p-2 rounded-lg border border-border text-xs text-ink-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download
              className="px-4 py-2 rounded-lg bg-ink text-surface text-xs font-medium flex items-center gap-1.5 shadow-minimal"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isProcessing || exporting}
              className="px-4 py-2 rounded-lg bg-cedar text-surface text-xs font-medium flex items-center gap-1.5 disabled:opacity-40 shadow-minimal"
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
