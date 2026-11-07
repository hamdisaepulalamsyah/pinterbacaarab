'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Award,
  ChevronRight,
  Lightbulb,
  Check,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import NahwuBadge from '@/components/NahwuBadge';
import { PRACTICE_LESSONS, PracticeLesson, PracticeStep, PracticeOption } from '@/lib/practice-data';

export default function PracticePage() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(PRACTICE_LESSONS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [subQuestion, setSubQuestion] = useState<'kedudukan' | 'harakat'>('kedudukan');
  
  // Track which words in current lesson have been fully completed/revealed
  const [revealedWordIndices, setRevealedWordIndices] = useState<number[]>([]);
  
  // Selection and feedback state for active question
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'wrong';
    explanation: string;
  }>({ status: 'idle', explanation: '' });
  
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Metrics tracking
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentLesson = PRACTICE_LESSONS.find((l) => l.id === selectedLessonId) || PRACTICE_LESSONS[0];
  const currentStep = currentLesson.steps[currentStepIndex] || currentLesson.steps[0];
  const activeQuestion = subQuestion === 'kedudukan' ? currentStep.kedudukanQuestion : currentStep.harakatQuestion;

  // Reset when lesson changes
  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
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

  // Reset current lesson from scratch
  const handleRestart = () => {
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

  // Answer selection handler
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

  // Proceed to next sub-question or next word
  const handleProceedNext = () => {
    if (subQuestion === 'kedudukan') {
      // Move to harakat question for same word
      setSubQuestion('harakat');
      setSelectedOptionId(null);
      setFeedback({ status: 'idle', explanation: '' });
      setShowHint(false);
    } else {
      // Word completed! Reveal syakal
      const newRevealed = [...revealedWordIndices, currentStep.wordIndex];
      setRevealedWordIndices(newRevealed);

      if (currentStepIndex + 1 < currentLesson.steps.length) {
        // Move to next word
        setCurrentStepIndex((prev) => prev + 1);
        setSubQuestion('kedudukan');
        setSelectedOptionId(null);
        setFeedback({ status: 'idle', explanation: '' });
        setShowHint(false);
      } else {
        // Finished all words in this lesson!
        setIsCompleted(true);
      }
    }
  };

  // Calculate score accuracy
  const accuracyPercentage = attemptsCount > 0 
    ? Math.max(0, Math.round(((attemptsCount - wrongAttemptsCount) / attemptsCount) * 100))
    : 100;

  return (
    <div className="flex flex-col min-h-screen bg-canvas bg-ambient-fluid text-ink">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8 animate-fadeSlideUp">
        {/* Header Title & Talaqqi Mode Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderlight pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-surface text-xs font-mono text-cedar shadow-minimal">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Metode Sorogan &amp; Talaqqi Terbimbing</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Latihan Baca Arab Gundul
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-xl">
              Dibimbing langsung kata demi kata seperti bersama Ustadz di halaqah: tebak posisi nahwu,
              tentukan harakat yang tepat, dan buka syakal matan hingga tuntas!
            </p>
          </div>

          {/* Quick Lesson Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedLessonId}
              onChange={(e) => handleSelectLesson(e.target.value)}
              className="text-xs sm:text-sm font-medium bg-surface border border-border rounded-xl px-3.5 py-2 shadow-minimal outline-none focus:ring-2 focus:ring-cedar/30 transition cursor-pointer"
            >
              {PRACTICE_LESSONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.levelLabel.split(' ')[0]})
                </option>
              ))}
            </select>
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl border border-border bg-surface hover:bg-subtle text-ink-secondary transition shadow-minimal"
              title="Mulai Ulang Latihan Ini"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lesson Category Tabs for Instant Discovery */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRACTICE_LESSONS.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(lesson.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 ease-fluid flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cedar text-surface font-semibold shadow-minimal scale-[1.02]'
                    : 'bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-subtle'
                }`}
              >
                <span>{lesson.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-surface/20 text-surface' : 'bg-subtle text-ink-muted'
                }`}>
                  {lesson.steps.length} kata
                </span>
              </button>
            );
          })}
        </div>

        {!isCompleted ? (
          <>
            {/* PROGRESS & STATUS BAR */}
            <div className="bg-surface/90 backdrop-blur-sm rounded-xl border border-border p-4 shadow-minimal flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-cedar-soft text-cedar font-semibold">
                  {currentLesson.source}
                </span>
                <span className="text-ink-secondary">
                  Kata ke-<strong>{currentStepIndex + 1}</strong> dari {currentLesson.steps.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-ink-muted">Akurasi:</span>
                  <span className={`font-semibold ${accuracyPercentage >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {accuracyPercentage}%
                  </span>
                </div>
                {/* Progress bar visual */}
                <div className="w-28 sm:w-36 h-2 bg-subtle rounded-full overflow-hidden border border-borderlight">
                  <div
                    className="h-full bg-cedar transition-all duration-500 ease-fluid"
                    style={{
                      width: `${((currentStepIndex + (subQuestion === 'harakat' ? 0.5 : 0)) / currentLesson.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* MAIN INTERACTIVE MATAN BOARD (Words Row) */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-float space-y-6 text-center">
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted border-b border-borderlight pb-3">
                <span>Naskah Matan (Tebak Syakal &amp; Kedudukan)</span>
                <span className="text-cedar font-medium">Kata hijau = syakal terbuka</span>
              </div>

              {/* Matan Display Container */}
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-3xl sm:text-4xl md:text-5xl flex flex-wrap justify-center items-center gap-y-4 gap-x-2 py-4 select-none leading-[3.2] overflow-visible"
              >
                {currentLesson.steps.map((step, idx) => {
                  const isRevealed = revealedWordIndices.includes(step.wordIndex);
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={`${step.wordIndex}-${idx}`} className="relative inline-flex flex-col items-center">
                      <div
                        className={`px-4 py-2 rounded-2xl transition-all duration-300 ease-fluid relative select-none ${
                          isRevealed
                            ? 'text-cedar font-bold bg-cedar-soft/70 border border-cedar/30 shadow-minimal scale-100'
                            : isCurrent
                            ? 'bg-ochre-soft border-2 border-ochre text-ink font-bold shadow-glowOchre scale-110 z-10'
                            : 'text-ink-muted/50 bg-subtle/40 border border-transparent'
                        }`}
                      >
                        {/* Status Icon Indicator on top */}
                        {isRevealed && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cedar text-surface flex items-center justify-center text-[10px] shadow-minimal">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {isCurrent && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-ochre text-surface font-sans text-[9px] font-bold tracking-wider uppercase shadow-minimal animate-pulse">
                            Fokus
                          </span>
                        )}

                        <span className="block leading-relaxed">
                          {isRevealed ? step.wordVocalized : step.wordGundul}
                        </span>
                      </div>

                      {/* Word Meaning hint underneath if revealed */}
                      {isRevealed && (
                        <span className="font-sans text-[11px] text-ink-muted mt-1 select-none font-medium">
                          {step.meaning}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step Context Pill */}
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-ink-secondary">
                <span className="font-mono text-ink-muted">Arti Kata Aktif:</span>
                <span className="font-medium bg-subtle px-3 py-1 rounded-full">
                  &ldquo;{currentStep.meaning}&rdquo;
                </span>
                <NahwuBadge nahwuText={currentStep.nahwuRule} />
              </div>
            </div>

            {/* USTADZ MENTOR GUIDANCE & QUIZ WORKBENCH */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-float space-y-6 transition-all duration-300 ease-fluid">
              {/* Ustadz Avatar & Speech Box */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-subtle/60 border border-borderlight">
                <div className="w-12 h-12 rounded-2xl bg-cedar text-surface flex items-center justify-center shrink-0 shadow-minimal">
                  <GraduationCap className="w-6 h-6 text-ochre-light" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic font-semibold text-sm text-cedar">
                      Ustadz Pembimbing
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted bg-surface px-2 py-0.5 rounded border border-borderlight">
                      {subQuestion === 'kedudukan' ? 'Tahap 1: Kedudukan Nahwu' : 'Tahap 2: Harakat & Syakal'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                    {activeQuestion.prompt}
                  </p>
                </div>
              </div>

              {/* Hint Box (if toggled) */}
              {showHint && (
                <div className="p-4 rounded-xl bg-ochre-soft/80 border border-ochre/30 flex items-start gap-3 animate-fadeSlideDown text-xs text-ink-secondary">
                  <Lightbulb className="w-4 h-4 text-ochre shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-ochre block">Petunjuk Kaidah dari Ustadz:</span>
                    <p className="leading-relaxed">{activeQuestion.hint}</p>
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                  Pilih Jawaban yang Tepat:
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;
                    const isWrong = isSelected && !isCorrect;

                    let btnStyle = 'bg-surface border-border hover:border-cedar/40 hover:bg-subtle/50 text-ink';

                    if (feedback.status !== 'idle') {
                      if (isSelected && isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20';
                      } else if (isWrong) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20';
                      } else if (isCorrect && feedback.status === 'wrong') {
                        // Keep neutral or subtle so user can try again
                        btnStyle = 'bg-surface border-border text-ink opacity-70';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={feedback.status === 'correct'}
                        onClick={() => handleChooseOption(opt)}
                        className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ease-fluid flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer disabled:cursor-default active:scale-[0.99] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                            isSelected && isCorrect
                              ? 'bg-emerald-600 border-emerald-600 text-surface'
                              : isWrong
                              ? 'bg-rose-600 border-rose-600 text-surface'
                              : 'bg-subtle border-border text-ink-secondary'
                          }`}>
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="font-medium leading-relaxed">{opt.label}</span>
                        </div>

                        {isSelected && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isWrong && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Feedback Message Card */}
              {feedback.status !== 'idle' && (
                <div
                  className={`p-4 sm:p-5 rounded-xl border animate-fadeSlideUp space-y-2 text-xs sm:text-sm leading-relaxed ${
                    feedback.status === 'correct'
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/90 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {feedback.status === 'correct' ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>Mumtaz! Penjelasan Ustadz:</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-rose-700" />
                        <span>Teguran &amp; Pelajaran dari Ustadz:</span>
                      </>
                    )}
                  </div>
                  <p>{feedback.explanation}</p>
                </div>
              )}

              {/* Action Controls Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-borderlight">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ochre transition"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Tutup Petunjuk' : 'Minta Petunjuk Ustadz'}</span>
                </button>

                {feedback.status === 'correct' && (
                  <button
                    type="button"
                    onClick={handleProceedNext}
                    className="px-5 py-2.5 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-minimal hover:shadow-glow active:scale-95 animate-scaleIn"
                  >
                    <span>
                      {subQuestion === 'kedudukan'
                        ? 'Lanjut Tentukan Harakat'
                        : currentStepIndex + 1 < currentLesson.steps.length
                        ? 'Lanjut ke Kata Berikutnya'
                        : 'Selesaikan Halaqah'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* CELEBRATION & LESSON SUMMARY SCREEN */
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-float text-center space-y-8 animate-scaleIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-cedar text-ochre-light flex items-center justify-center shadow-float">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-cedar font-semibold block">
                Alhamdulillah! Selesai Membaca Matan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                {currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary">
                {currentLesson.translation}
              </p>
            </div>

            {/* Vocalized Matan Highlight Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-subtle/60 border border-border text-center space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted block">
                Naskah Lengkap Bersyakal Sempurna
              </span>
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-3xl sm:text-4xl md:text-5xl text-cedar font-bold leading-[3]"
              >
                {currentLesson.fullMatanVocalized}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-xs font-mono">
              <div className="p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block">Total Kata</span>
                <span className="text-lg font-bold text-ink">{currentLesson.steps.length} Lafaz</span>
              </div>
              <div className="p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block">Skor Akurasi</span>
                <span className="text-lg font-bold text-emerald-800">{accuracyPercentage}%</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl border border-borderlight bg-surface space-y-1">
                <span className="text-ink-muted block">Predikat Talaqqi</span>
                <span className="text-lg font-bold text-cedar">
                  {accuracyPercentage >= 90 ? 'Mumtaz' : accuracyPercentage >= 75 ? 'Jayyid Jiddan' : 'Jayyid'}
                </span>
              </div>
            </div>

            {/* Breakdown Table of Words Learned */}
            <div className="text-left space-y-3 max-w-2xl mx-auto pt-4 border-t border-borderlight">
              <h3 className="font-serif text-lg font-medium text-ink">
                Ringkasan Kaidah Nahwu &amp; Shorof yang Dipelajari
              </h3>
              <div className="space-y-2">
                {currentLesson.steps.map((st) => (
                  <div
                    key={st.wordIndex}
                    className="p-3.5 rounded-xl border border-borderlight bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-arabic text-xl font-bold text-cedar min-w-16 text-right">
                        {st.wordVocalized}
                      </span>
                      <span className="text-ink-secondary">({st.meaning})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                      <span>Wazan: <strong className="text-ink font-arabic">{st.wazan}</strong></span>
                      <span>•</span>
                      <span>Akar: <strong className="text-ink">{st.root}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-subtle text-ink-secondary text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Matan Ini</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentIndex = PRACTICE_LESSONS.findIndex((l) => l.id === selectedLessonId);
                  const nextLesson = PRACTICE_LESSONS[(currentIndex + 1) % PRACTICE_LESSONS.length];
                  handleSelectLesson(nextLesson.id);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cedar hover:bg-cedar-hover text-surface text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-minimal"
              >
                <span>Lanjut ke Hadis Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}