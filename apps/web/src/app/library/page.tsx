'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowRight, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LibraryPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (docId: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Hapus naskah kajian "${title || 'Tanpa Judul'}" dari arsip? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeletingId(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      } else {
        const err = await res.json();
        alert(`Gagal menghapus: ${err.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message || 'Koneksi bermasalah'}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-ambient-fluid text-ink pb-24 sm:pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-5 py-10 sm:py-14 animate-fadeSlideUp">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              Arsip Kajian
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Daftar naskah hadis dan matan kitab yang telah ditelaah.
            </p>
          </div>

          <Link
            href="/new"
            className="px-4 py-1.5 rounded-full bg-ink text-surface text-xs font-medium hover:bg-stone-800 transition-all duration-300 ease-fluid flex items-center gap-1.5 shadow-minimal hover:shadow-float active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kajian Baru</span>
          </Link>
        </div>

        {/* Minimal Search Bar */}
        <div className="mb-8 relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari naskah kajian..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-xs sm:text-sm focus:border-cedar focus:shadow-glow focus:outline-none transition-all duration-300 ease-fluid shadow-minimal"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface border border-borderlight space-y-3.5 animate-pulse shadow-minimal"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 rounded-md skeleton-shimmer"></div>
                  <div className="h-3 w-16 rounded skeleton-shimmer"></div>
                </div>
                <div className="h-6 w-3/4 rounded-md skeleton-shimmer ml-auto"></div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-3 w-28 rounded skeleton-shimmer"></div>
                  <div className="h-3 w-20 rounded skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif italic text-sm text-ink-muted">
              {searchQuery ? 'Tidak ada naskah yang cocok' : 'Belum ada kajian tersimpan'}
            </p>
            {!searchQuery && (
              <Link
                href="/new"
                className="inline-block text-xs font-medium text-cedar hover:underline"
              >
                Mulai analisis kajian pertama →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((d) => (
              <Link
                key={d.id}
                href={`/d/${d.id}`}
                className="p-5 rounded-2xl bg-surface border border-borderlight hover:border-cedar/30 hover:shadow-float transition-all duration-300 ease-fluid flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 group cursor-pointer"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg text-ink font-normal group-hover:text-cedar transition-colors duration-200 line-clamp-1">
                      {d.title}
                    </span>
                    {d.status === 'needs_review' && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono">
                        Tashih
                      </span>
                    )}
                  </div>

                  <p className="font-arabic text-xl text-ink-secondary text-right line-clamp-1 py-1 group-hover:text-ink transition-colors duration-200">
                    {d.source_text}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-56 shrink-0 text-xs text-ink-muted">
                  <span>{d.source_name || 'Kajian'}</span>
                  <span>•</span>
                  <span>{d.word_count || 0} kata</span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(d.id, d.title, e)}
                    disabled={deletingId === d.id}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50 transition-all duration-200 ease-fluid hover:scale-110 active:scale-95 ml-1"
                    title="Hapus naskah kajian"
                  >
                    {deletingId === d.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:translate-x-1 group-hover:text-cedar transition-all duration-300 ease-fluid" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
