'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  FileText,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Search,
  Lock,
  RefreshCw,
  Clock,
  Laptop,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AdminDashboardPage() {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<{
    metrics: {
      totalDocuments: number;
      totalUsers: number;
      totalWords: number;
      statusBreakdown: {
        ready: number;
        needs_review: number;
        processing: number;
        exported: number;
      };
    };
    users: any[];
    documents: any[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'documents' | 'users'>('documents');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pba_admin_key');
    if (saved) {
      setPasskey(saved);
      fetchDashboard(saved);
    }
  }, []);

  const fetchDashboard = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/dashboard?key=${encodeURIComponent(key)}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Akses ditolak.');
      }
      setData(json);
      setIsAuthenticated(true);
      localStorage.setItem('pba_admin_key', key);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat dashboard admin.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;
    fetchDashboard(passkey.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('pba_admin_key');
    setIsAuthenticated(false);
    setData(null);
    setPasskey('');
  };

  // Filter Dokumen
  const filteredDocuments = (data?.documents || []).filter((doc) => {
    if (selectedUserFilter && doc.user_id !== selectedUserFilter) {
      return false;
    }
    if (!searchDocQuery.trim()) return true;
    const q = searchDocQuery.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(q) ||
      doc.source_name?.toLowerCase().includes(q) ||
      doc.creator?.displayName?.toLowerCase().includes(q) ||
      doc.creator?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-canvas bg-ambient-fluid text-ink pb-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fadeSlideUp">
        {/* Passkey Login Modal / View */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-surface border border-border shadow-float text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cedar-soft text-cedar mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <h1 className="font-serif text-2xl text-ink font-normal">Dashboard Pemilik</h1>
              <p className="text-xs text-ink-secondary mt-1">
                Akses khusus Hamdipyxis untuk memantau pengunjung &amp; naskah kajian.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Masukkan Kunci Rahasia Admin..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-canvas/40 text-center text-sm font-mono tracking-widest focus:border-cedar focus:outline-none transition"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !passkey.trim()}
                className="w-full py-3 rounded-xl bg-cedar hover:bg-cedar-hover text-surface font-medium text-xs transition flex items-center justify-center gap-2 shadow-minimal disabled:opacity-40"
              >
                {loading ? 'Memverifikasi...' : 'Buka Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderlight pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cedar font-semibold px-2 py-0.5 rounded bg-cedar-soft">
                    Super Admin Control
                  </span>
                  <span className="text-xs text-ink-muted">• Hamdipyxis</span>
                </div>
                <h1 className="font-serif text-3xl text-ink font-normal tracking-tight mt-1">
                  Pusat Kendali Pengguna &amp; Arsip
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchDashboard(passkey)}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-surface text-xs font-medium text-ink-secondary hover:text-ink flex items-center gap-1.5 transition active:scale-95 shadow-minimal"
                  title="Perbarui Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Segarkan</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50 transition"
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-minimal space-y-1">
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Pengguna / Perangkat</span>
                  <Users className="w-4 h-4 text-cedar" />
                </div>
                <div className="font-serif text-3xl font-medium text-ink">
                  {data?.metrics.totalUsers.toLocaleString()}
                </div>
                <p className="text-[11px] text-ink-muted">Pengunjung yang beraktivitas</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-minimal space-y-1">
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Total Kajian</span>
                  <FileText className="w-4 h-4 text-cedar" />
                </div>
                <div className="font-serif text-3xl font-medium text-ink">
                  {data?.metrics.totalDocuments.toLocaleString()}
                </div>
                <p className="text-[11px] text-ink-muted">Dokumen hadis &amp; kitab</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-minimal space-y-1">
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Kata Terbedah</span>
                  <BookOpen className="w-4 h-4 text-ochre" />
                </div>
                <div className="font-serif text-3xl font-medium text-ink">
                  {data?.metrics.totalWords.toLocaleString()}
                </div>
                <p className="text-[11px] text-ink-muted">Lafaz dianalisis nahwu-shorof</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border shadow-minimal space-y-1">
                <div className="flex items-center justify-between text-ink-muted">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Modul Cetak PDF</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="font-serif text-3xl font-medium text-ink">
                  {data?.metrics.statusBreakdown.exported.toLocaleString()}
                </div>
                <p className="text-[11px] text-ink-muted">Naskah selesai diekspor</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-borderlight pb-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('documents');
                  setSelectedUserFilter(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
                  activeTab === 'documents'
                    ? 'bg-ink text-surface shadow-minimal'
                    : 'text-ink-secondary hover:text-ink hover:bg-subtle'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Seluruh Naskah Kajian ({data?.documents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-ink text-surface shadow-minimal'
                    : 'text-ink-secondary hover:text-ink hover:bg-subtle'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Daftar Pengguna ({data?.users.length})</span>
              </button>
            </div>

            {/* Tab: Seluruh Naskah */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari judul, kitab, atau nama pengguna..."
                      value={searchDocQuery}
                      onChange={(e) => setSearchDocQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface text-xs focus:border-cedar focus:outline-none transition shadow-minimal"
                    />
                  </div>

                  {selectedUserFilter && (
                    <div className="flex items-center gap-2 text-xs bg-cedar-soft px-3 py-1.5 rounded-lg text-cedar">
                      <span>Filter aktif untuk satu pengguna</span>
                      <button
                        type="button"
                        onClick={() => setSelectedUserFilter(null)}
                        className="underline hover:text-ink font-semibold ml-1"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {/* Documents Table */}
                <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-minimal">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-subtle/60 border-b border-borderlight font-mono text-[10px] uppercase text-ink-muted tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Judul Kajian</th>
                          <th className="py-3 px-4">Pemilik / Pengguna</th>
                          <th className="py-3 px-4">Jumlah Kata</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Waktu Buat</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderlight">
                        {filteredDocuments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-ink-muted font-serif italic">
                              Tidak ada naskah yang cocok.
                            </td>
                          </tr>
                        ) : (
                          filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="hover:bg-subtle/40 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-medium text-ink line-clamp-1">{doc.title}</div>
                                <div className="text-[11px] text-ink-muted">{doc.source_name || '-'}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-medium text-ink">
                                  {doc.creator?.displayName || 'Tamu'}
                                </div>
                                <div className="text-[10px] font-mono text-ink-muted truncate max-w-[160px]">
                                  {doc.creator?.email}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono">{doc.word_count || 0} kata</td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                  doc.status === 'ready'
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : doc.status === 'needs_review'
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-subtle text-ink-muted'
                                }`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-ink-muted font-mono text-[11px]">
                                {new Date(doc.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Link
                                  href={`/d/${doc.id}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-subtle hover:bg-cedar hover:text-surface text-ink-secondary text-[11px] transition font-medium"
                                >
                                  <span>Buka</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Daftar Pengguna */}
            {activeTab === 'users' && (
              <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-minimal">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-subtle/60 border-b border-borderlight font-mono text-[10px] uppercase text-ink-muted tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Pengguna</th>
                        <th className="py-3 px-4">Perangkat / Browser</th>
                        <th className="py-3 px-4">Total Kajian</th>
                        <th className="py-3 px-4">Total Kata</th>
                        <th className="py-3 px-4">Terdaftar Sejak</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderlight">
                      {(data?.users || []).map((u) => (
                        <tr key={u.id} className="hover:bg-subtle/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-ink">{u.displayName}</div>
                            <div className="text-[10px] font-mono text-ink-muted">{u.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-ink-secondary text-[11px] max-w-[200px] truncate" title={u.userAgent}>
                            <div className="flex items-center gap-1.5">
                              <Laptop className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                              <span className="truncate">{u.userAgent}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium">{u.docCount} kajian</td>
                          <td className="py-3.5 px-4 font-mono text-ink-muted">{u.totalWords} kata</td>
                          <td className="py-3.5 px-4 text-ink-muted font-mono text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUserFilter(u.id);
                                setActiveTab('documents');
                              }}
                              className="px-2.5 py-1 rounded-md bg-subtle hover:bg-ink hover:text-surface text-ink-secondary text-[11px] transition"
                            >
                              Lihat Naskah ({u.docCount})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
