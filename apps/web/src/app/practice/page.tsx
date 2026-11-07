'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Award,
  ChevronRight,
  Lightbulb,
  Check,
  FolderOpen,
  BookOpen,
  Loader2,
  Bot,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import NahwuBadge from '@/components/NahwuBadge';
import {
  PRACTICE_LESSONS,
  PracticeLesson,
  PracticeOption,
  convertDocToPracticeLesson,
} from '@/lib/practice-data';

export default function PracticePage() {
  // Source Mode: 'presets' (Curated Hadiths) or 'archive' (User's Saved Docs)
  const [sourceMode, setSourceMode] = useState<'presets' | 'archive'>('presets');

  // Archive Documents List
  const [archivedDocs, setArchivedDocs] = useState<any[]>([]);
  const [loadingArchive, setLoadingArchive] = useState<boolean>(false);
  const [loadingDocDetail, setLoadingDocDetail] = useState<boolean>(false);

  // Active Lesson
  const [customLesson, setCustomLesson] = useState<PracticeLesson | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRACTICE_LESSONS[0].id);

  // Step and question tracking
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [subQuestion, setSubQuestion] = useState<'kedudukan' | 'harakat'>('kedudukan');

  // Revealed words
  const [revealedWordIndices, setRevealedWordIndices] = useState<number[]>([]);

  // Selection & Feedback
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'wrong';
    explanation: string;
  }>({ status: 'idle', explanation: '' });

  const [showHint, setShowHint] = useState<boolean>(false);

  // Metrics
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Fetch user's archived documents when switching to archive mode
  useEffect(() => {
    if (sourceMode === 'archive' && archivedDocs.length === 0) {
      fetchUserDocuments();
    }
  }, [sourceMode]);

  const fetchUserDocuments = async () => {
    setLoadingArchive(true);
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setArchivedDocs(data.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch user documents:', err);
    } finally {
      setLoadingArchive(false);
    }
  };

  // Load a specific archived document as practice lesson
  const handleSelectArchivedDoc = async (docId: string) => {
    setLoadingDocDetail(true);
    try {
      const res = await fetch(`/api/documents/${docId}`);
      if (res.ok) {
        const data = await res.json();
        const doc = data.document;
        if (doc) {
          const generated = convertDocToPracticeLesson(doc);
          if (generated.steps.length > 0) {
            setCustomLesson(generated);
            resetSessionState();
          } else {
            alert('Dokumen ini belum selesai dianalisis atau belum memiliki kata.');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load document for practice:', err);
    } finally {
      setLoadingDocDetail(false);
    }
  };

  const currentLesson: PracticeLesson =
    sourceMode === 'archive' && customLesson
      ? customLesson
      : PRACTICE_LESSONS.find((l) => l.id === selectedPresetId) || PRACTICE_LESSONS[0];

  const currentStep = currentLesson.steps[currentStepIndex] || currentLesson.steps[0];
  const activeQuestion =
    subQuestion === 'kedudukan' ? currentStep.kedudukanQuestion : currentStep.harakatQuestion;

  const resetSessionState = () => {
    setCurrentStepIndex(0);
    setSubQuestion('kedudukan');
    setRevealedWordIndices([]);
    setSelectedOptionId(null);
    setFeedback({ status: 'idle', explanation: '' });
    setShowHint(false);
    setAttemptsCount(0);
    setWrongAttemptsCount(0);
    setIsCompleted(false);
  };

  const handleSelectPreset = (lessonId: string) => {
    setSelectedPresetId(lessonId);
    setCustomLesson(null);
    resetSessionState();
  };

  const handleRestart = () => {
    resetSessionState();
  };

  const handleChooseOption = (option: PracticeOption) => {
    setSelectedOptionId(option.id);
    setAttemptsCount((prev) => prev + 1);

    if (option.isCorrect) {
      setFeedback({
        status: 'correct',
        explanation: option.explanation,
      });
    } else {
      setWrongAttemptsCount((prev) => prev + 1);
      setFeedback({
        status: 'wrong',
        explanation: option.explanation,
      });
    }
  };

  const handleProceedNext = () => {
    if (subQuestion === 'kedudukan') {
      setSubQuestion('harakat');
      setSelectedOptionId(null);
      setFeedback({ status: 'idle', explanation: '' });
      setShowHint(false);
    } else {
      const newRevealed = [...revealedWordIndices, currentStep.wordIndex];
      setRevealedWordIndices(newRevealed);

      if (currentStepIndex + 1 < currentLesson.steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
        setSubQuestion('kedudukan');
        setSelectedOptionId(null);
        setFeedback({ status: 'idle', explanation: '' });
        setShowHint(false);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const accuracyPercentage =
    attemptsCount > 0
      ? Math.max(0, Math.round(((attemptsCount - wrongAttemptsCount) / attemptsCount) * 100))
      : 100;

  return (
    <div className="flex flex-col min-h-screen bg-canvas bg-ambient-fluid text-ink pb-12 sm:pb-16">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 w-full space-y-6 sm:space-y-8 animate-fadeSlideUp">
        {/* Simple & Clean Header (No Clutter, No AI-looking Capsules) */}
        <div className="space-y-2 text-left">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-normal tracking-tight">
            Latihan Baca Arab Gundul
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-xl leading-relaxed">
            Asisten akan memandu tebak kedudukan nahwu dan harakat kata demi kata. Pilih naskah hadis
            atau gunakan teks dari arsip kajianmu.
          </p>
        </div>

        {/* Source Mode Switcher: Preset Hadis vs Arsip Saya */}
        <div className="flex items-center gap-2 p-1 bg-subtle/80 rounded-xl border border-borderlight w-fit">
          <button
            type="button"
            onClick={() => {
              setSourceMode('presets');
              setCustomLesson(null);
              resetSessionState();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-fluid flex items-center gap-1.5 ${
              sourceMode === 'presets'
                ? 'bg-surface text-ink font-semibold shadow-minimal'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cedar" />
            <span>Contoh Hadis</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceMode('archive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-fluid flex items-center gap-1.5 ${
              sourceMode === 'archive'
                ? 'bg-surface text-ink font-semibold shadow-minimal'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-ochre" />
            <span>Dari Arsip Saya</span>
          </button>
        </div>

        {/* SUB-SELECTOR: Presets Carousel vs Archive Document Picker */}
        {sourceMode === 'presets' ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {PRACTICE_LESSONS.map((lesson) => {
              const isSelected = lesson.id === selectedPresetId;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectPreset(lesson.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-200 ease-fluid flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-cedar text-surface font-semibold shadow-minimal'
                      : 'bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-subtle'
                  }`}
                >
                  <span>{lesson.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-surface/20 text-surface' : 'bg-subtle text-ink-muted'
                    }`}
                  >
                    {lesson.steps.length} kata
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Archive Picker Dropdown / List */
          <div className="p-4 rounded-xl border border-border bg-surface shadow-minimal space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>Pilih Dokumen Arsip Kajian Anda:</span>
              {loadingDocDetail && (
                <span className="text-cedar flex items-center gap-1 font-sans">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyiapkan naskah...</span>
                </span>
              )}
            </div>

            {loadingArchive ? (
              <div className="py-6 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cedar" />
                <span>Memuat koleksi arsip...</span>
              </div>
            ) : archivedDocs.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-ink-secondary">
                  Belum ada dokumen di arsip perangkat ini.
                </p>
                <Link
                  href="/new"
                  className="inline-flex items-center gap-1 text-xs text-cedar font-semibold hover:underline"
                >
                  <span>+ Analisis naskah baru sekarang</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {archivedDocs.map((doc) => {
                  const isCurrent = customLesson?.id === `doc-${doc.id}`;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleSelectArchivedDoc(doc.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 ease-fluid flex flex-col gap-1 cursor-pointer ${
                        isCurrent
                          ? 'border-cedar bg-cedar-soft/70 shadow-minimal'
                          : 'border-borderlight hover:border-cedar/40 hover:bg-subtle/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-ink truncate max-w-[200px]">
                          {doc.title || 'Dokumen Tanpa Judul'}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted">
                          {doc.word_count || 0} kata
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-secondary truncate">
                        {doc.source_name || 'Teks Pribadi'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!isCompleted ? (
          <>
            {/* PROGRESS & STATUS BAR (Mobile-friendly) */}
            <div className="bg-surface/90 backdrop-blur-sm rounded-xl border border-border p-3 sm:p-4 shadow-minimal flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-ink truncate max-w-[150px] sm:max-w-xs">
                  {currentLesson.title}
                </span>
                <span className="text-ink-muted hidden sm:inline">•</span>
                <span className="text-ink-secondary shrink-0">
                  {currentStepIndex + 1}/{currentLesson.steps.length}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-ink-muted hidden sm:inline">Akurasi:</span>
                  <span
                    className={`font-semibold ${
                      accuracyPercentage >= 80 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {accuracyPercentage}%
                  </span>
                </div>

                <div className="w-16 sm:w-28 h-2 bg-subtle rounded-full overflow-hidden border border-borderlight">
                  <div
                    className="h-full bg-cedar transition-all duration-300 ease-fluid"
                    style={{
                      width: `${
                        ((currentStepIndex + (subQuestion === 'harakat' ? 0.5 : 0)) /
                          currentLesson.steps.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-subtle transition"
                  title="Mulai Ulang"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MATAN DISPLAY BOARD */}
            <div className="bg-surface rounded-2xl border border-border p-4 sm:p-7 shadow-float space-y-4 text-center">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted border-b border-borderlight pb-2.5">
                <span>Naskah Matan</span>
                <span className="text-cedar font-medium">Kata hijau = syakal terbuka</span>
              </div>

              {/* Matan Words Row (Optimized for Mobile Touch) */}
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl md:text-4xl flex flex-wrap justify-center items-center gap-y-3 gap-x-1.5 sm:gap-x-2 py-2 sm:py-4 select-none leading-[3] sm:leading-[3.3] overflow-visible"
              >
                {currentLesson.steps.map((step, idx) => {
                  const isRevealed = revealedWordIndices.includes(step.wordIndex);
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={`${step.wordIndex}-${idx}`}
                      className="relative inline-flex flex-col items-center"
                    >
                      <div
                        className={`min-h-[44px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 ease-fluid relative select-none flex items-center justify-center ${
                          isRevealed
                            ? 'text-cedar font-bold bg-cedar-soft/80 border border-cedar/30 shadow-minimal'
                            : isCurrent
                            ? 'bg-ochre-soft/90 border-2 border-ochre text-ink font-bold shadow-glowOchre scale-105 z-10'
                            : 'text-ink-muted/50 bg-subtle/40 border border-transparent'
                        }`}
                      >
                        {isRevealed && (
                          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cedar text-surface flex items-center justify-center text-[9px]">
                            <Check className="w-2 h-2" />
                          </span>
                        )}

                        <span className="block leading-relaxed">
                          {isRevealed ? step.wordVocalized : step.wordGundul}
                        </span>
                      </div>

                      {/* Meaning caption */}
                      {isRevealed && (
                        <span className="font-sans text-[10px] sm:text-[11px] text-ink-muted mt-0.5 select-none font-medium truncate max-w-[85px] sm:max-w-none">
                          {step.meaning}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Word Meaning Hint */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-secondary">
                <span className="font-mono text-ink-muted text-[11px]">Arti kata fokus:</span>
                <span className="font-medium bg-subtle px-2.5 py-0.5 rounded-md">
                  &ldquo;{currentStep.meaning}&rdquo;
                </span>
                <NahwuBadge nahwuText={currentStep.nahwuRule} />
              </div>
            </div>

            {/* ASISTEN GUIDANCE & QUIZ WORKBENCH */}
            <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-float space-y-5 transition-all duration-200">
              {/* Asisten Speech Card */}
              <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-subtle/60 border border-borderlight">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cedar text-surface flex items-center justify-center shrink-0 shadow-minimal">
                  <Bot className="w-5 h-5 text-ochre-light" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic font-semibold text-xs sm:text-sm text-cedar">
                      Asisten
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted bg-surface px-2 py-0.5 rounded border border-borderlight">
                      {subQuestion === 'kedudukan' ? 'Tahap 1: Kedudukan' : 'Tahap 2: Harakat'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                    {activeQuestion.prompt}
                  </p>
                </div>
              </div>

              {/* Hint Box (if toggled) */}
              {showHint && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-ochre-soft/90 border border-ochre/30 flex items-start gap-2.5 text-xs text-ink-secondary animate-fadeSlideDown">
                  <Lightbulb className="w-4 h-4 text-ochre shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-ochre block text-[11px] uppercase tracking-wider">
                      Petunjuk Asisten:
                    </span>
                    <p className="leading-relaxed">{activeQuestion.hint}</p>
                  </div>
                </div>
              )}

              {/* Options List (Optimized for Mobile Tap Area) */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                  Pilih Jawaban:
                </span>
                <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;
                    const isWrong = isSelected && !isCorrect;

                    let btnStyle =
                      'bg-surface border-border hover:border-cedar/40 hover:bg-subtle/50 text-ink';

                    if (feedback.status !== 'idle') {
                      if (isSelected && isCorrect) {
                        btnStyle =
                          'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20';
                      } else if (isWrong) {
                        btnStyle =
                          'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500/20';
                      } else if (isCorrect && feedback.status === 'wrong') {
                        btnStyle = 'bg-surface border-border text-ink opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={feedback.status === 'correct'}
                        onClick={() => handleChooseOption(opt)}
                        className={`w-full min-h-[50px] p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 ease-fluid flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer disabled:cursor-default active:scale-[0.99] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                              isSelected && isCorrect
                                ? 'bg-emerald-600 border-emerald-600 text-surface'
                                : isWrong
                                ? 'bg-rose-600 border-rose-600 text-surface'
                                : 'bg-subtle border-border text-ink-secondary'
                            }`}
                          >
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="font-medium leading-relaxed">{opt.label}</span>
                        </div>

                        {isSelected && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isWrong && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Alert */}
              {feedback.status !== 'idle' && (
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border animate-fadeSlideUp space-y-1.5 text-xs sm:text-sm leading-relaxed ${
                    feedback.status === 'correct'
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/90 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {feedback.status === 'correct' ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>Tepat! Penjelasan Asisten:</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-rose-700" />
                        <span>Penjelasan Asisten:</span>
                      </>
                    )}
                  </div>
                  <p>{feedback.explanation}</p>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-borderlight">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="w-full sm:w-auto py-2 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ochre transition"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Tutup Petunjuk' : 'Minta Petunjuk Asisten'}</span>
                </button>

                {feedback.status === 'correct' && (
                  <button
                    type="button"
                    onClick={handleProceedNext}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal active:scale-95 animate-scaleIn"
                  >
                    <span>
                      {subQuestion === 'kedudukan'
                        ? 'Lanjut Tentukan Harakat'
                        : currentStepIndex + 1 < currentLesson.steps.length
                        ? 'Lanjut ke Kata Berikutnya'
                        : 'Selesai'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* COMPLETION SCREEN */
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-10 shadow-float text-center space-y-6 sm:space-y-8 animate-scaleIn">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-cedar text-ochre-light flex items-center justify-center shadow-float">
              <Award className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5 max-w-lg mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-cedar font-semibold block">
                Selesai Membaca Matan
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                {currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {currentLesson.translation}
              </p>
            </div>

            {/* Vocalized Matan Display */}
            <div className="p-5 sm:p-7 rounded-2xl bg-subtle/60 border border-border text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">
                Naskah Lengkap Bersyakal
              </span>
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl md:text-4xl text-cedar font-bold leading-[3] sm:leading-[3.3]"
              >
                {currentLesson.fullMatanVocalized}
              </div>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto text-xs font-mono">
              <div className="p-3 sm:p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block text-[11px]">Total Kata</span>
                <span className="text-base sm:text-lg font-bold text-ink">
                  {currentLesson.steps.length} Lafaz
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block text-[11px]">Akurasi</span>
                <span className="text-base sm:text-lg font-bold text-emerald-800">
                  {accuracyPercentage}%
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block text-[11px]">Evaluasi</span>
                <span className="text-base sm:text-lg font-bold text-cedar">
                  {accuracyPercentage >= 90
                    ? 'Sangat Baik'
                    : accuracyPercentage >= 75
                    ? 'Baik'
                    : 'Perlu Latihan'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-surface hover:bg-subtle text-ink-secondary text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Naskah Ini</span>
              </button>

              {sourceMode === 'presets' ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = PRACTICE_LESSONS.findIndex(
                      (l) => l.id === selectedPresetId,
                    );
                    const nextLesson =
                      PRACTICE_LESSONS[(currentIndex + 1) % PRACTICE_LESSONS.length];
                    handleSelectPreset(nextLesson.id);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal"
                >
                  <span>Lanjut Hadis Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomLesson(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal"
                >
                  <span>Pilih Dokumen Arsip Lain</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}