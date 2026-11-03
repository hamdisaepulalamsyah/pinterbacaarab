'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const filteredDocs = documents.filter((d) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = d.title?.toLowerCase().includes(q);
    const sourceMatch = d.source_name?.toLowerCase().includes(q);
    const textMatch = d.source_text?.toLowerCase().includes(q);
    return titleMatch || sourceMatch || textMatch;
  });

  return (
    <div className="min-h-screen bg-parchment-pattern text-ink pb-24 md:pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-4xl text-forest tracking-tight">
              Koleksi Lembaran Kajian
            </h1>
            <p className="text-xs md:text-sm text-ink-muted mt-1 leading-relaxed">
              Arsip analisis teks Arab, telaah matan hadis, dan lembar i&apos;rab nahwu-shorof Anda.
            </p>
          </div>

          <Link
            href="/new"
            className="self-start sm:self-auto px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest-hover text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-card border border-gold/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-gold-light" />
            <span>Kajian Baru</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="w-4 h-4 text-ink-soft absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul dokumen, sumber kitab, atau cuplikan teks Arab..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sand bg-surface text-ink placeholder:text-ink-soft/60 focus:border-forest focus:outline-none text-xs md:text-sm shadow-card transition"
          />
        </div>

        {/* Content Stream */}
        {loading ? (
          <div className="p-16 text-center text-ink-muted flex flex-col items-center justify-center gap-3">
            <span className="font-arabic text-3xl font-bold text-forest animate-pulse">ن</span>
            <span className="text-xs">Membuka lembaran arsip kajian...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-surface rounded-3xl p-12 border border-sand text-center max-w-md mx-auto space-y-4 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto border border-forest/20">
              <FileText className="w-8 h-8 text-forest" />
            </div>
            <h3 className="font-serif font-bold text-lg text-forest">
              {searchQuery ? 'Tidak Ada Hasil yang Cocok' : 'Belum Ada Lembaran Kajian'}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {searchQuery
                ? 'Silakan coba kata kunci pencarian yang lain.'
                : 'Mulai telaah teks hadis atau kutipan kitab Arab pertama Anda sekarang.'}
            </p>
            {!searchQuery && (
              <Link
                href="/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest text-white text-xs font-bold hover:bg-forest-hover transition shadow-card border border-gold/30"
              >
                <Plus className="w-4 h-4 text-gold-light" />
                <span>Buat Kajian Baru</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {filteredDocs.map((d) => {
              const isReady = d.status === 'ready';
              const isNeedsReview = d.status === 'needs_review';
              const isProcessing = d.status === 'queued' || d.status === 'processing';

              return (
                <Link
                  key={d.id}
                  href={`/d/${d.id}`}
                  className="bg-surface p-6 rounded-3xl border border-sand hover:border-forest/40 hover:shadow-card-hover transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Top Border Ornament on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark font-sans block mb-1">
                          {d.source_name || 'Kajian Mandiri'}
                        </span>
                        <h3 className="font-serif font-bold text-base md:text-lg text-forest group-hover:text-forest-hover transition line-clamp-1">
                          {d.title}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      {isReady && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Siap</span>
                        </span>
                      )}
                      {isNeedsReview && (
                        <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Tashih</span>
                        </span>
                      )}
                      {isProcessing && (
                        <span className="text-[11px] font-semibold text-forest bg-forest/10 border border-forest/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 animate-pulse">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Proses</span>
                        </span>
                      )}
                    </div>

                    {/* Arabic Text Snippet */}
                    <div className="bg-parchment-100 p-3.5 rounded-2xl border border-sand/70 text-right">
                      <p className="font-arabic text-lg md:text-xl text-forest line-clamp-2 leading-[2.2] select-none">
                        {d.source_text}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-3 border-t border-sand/50 flex items-center justify-between text-xs text-ink-soft">
                    <div className="flex items-center gap-3">
                      <span>{d.word_count || 0} Kata</span>
                      <span>•</span>
                      <span>
                        {new Date(d.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="text-forest font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Buka Lembaran</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
