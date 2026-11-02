'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LibraryPage() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-bgwarm text-ink pb-20">
      {/* Header */}
      <header className="border-b border-sand bg-surface sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-white font-arabic text-xl font-bold">
              ن
            </div>
            <span className="font-bold text-base text-forest">Nahwu Studio</span>
          </Link>

          <Link
            href="/new"
            className="px-4 py-2 rounded-lg bg-forest hover:bg-forest-hover text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Dokumen Baru</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-forest">Dokumen Kajian Saya</h1>
            <p className="text-xs text-ink/65 mt-1">
              Riwayat analisis teks Arab, hadis, dan modul kajian kitab Anda.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-ink/60 flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 animate-spin text-forest" />
            <span>Memuat berkas kajian...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-surface rounded-2xl p-12 border border-sand text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-forest">Belum Ada Dokumen</h3>
            <p className="text-xs text-ink/70">
              Mulai telaah teks hadis atau kitab Arab gundul pertama Anda sekarang.
            </p>
            <Link
              href="/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-hover transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Dokumen Baru</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((d) => (
              <Link
                key={d.id}
                href={`/d/${d.id}`}
                className="bg-surface p-5 rounded-2xl border border-sand hover:border-forest/40 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-ink group-hover:text-forest transition line-clamp-1">
                      {d.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                        d.status === 'ready' || d.status === 'exported'
                          ? 'bg-forest/10 text-forest'
                          : d.status === 'needs_review'
                            ? 'bg-alert/10 text-alert'
                            : 'bg-sand text-ink/70'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>

                  {d.source_name && (
                    <div className="text-xs text-gold-dark font-medium mb-3">{d.source_name}</div>
                  )}

                  <div className="font-arabic text-lg text-ink/85 line-clamp-2 leading-relaxed text-right bg-bgwarm/30 p-2.5 rounded-lg mb-4">
                    {d.source_text}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-ink/50 pt-3 border-t border-sand">
                  <span>{d.word_count || 0} Kata</span>
                  <div className="flex items-center gap-1 text-forest font-semibold group-hover:translate-x-0.5 transition">
                    <span>Buka Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
