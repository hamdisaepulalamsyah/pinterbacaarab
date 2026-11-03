import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scroll,
  Layers,
  Download,
  BookMarked,
  Search,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-parchment-pattern text-ink">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 w-full flex flex-col items-center text-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sandlight text-forest text-xs font-semibold mb-6 border border-gold/40 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-gold"></span>
          <span className="font-serif">Didukung Model Bahasa Khusus Nahwu-Shorof</span>
          <span className="text-gold-dark font-mono">100% Validasi Konsonan</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl text-forest max-w-4xl leading-[1.15] md:leading-[1.18] mb-6 tracking-tight">
          Bedah Teks Arab Gundul Menjadi{' '}
          <span className="relative inline-block text-gold-dark">
            Kajian Nahwu &amp; Shorof
            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-gold/30 rounded-full"></span>
          </span>{' '}
          Siap Cetak
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-ink-muted max-w-2xl mb-10 leading-relaxed font-normal">
          Ubah matan hadis dan kutipan kitab kuning menjadi dokumen bersyakal presisi, terjemah
          makna kata, uraian kedudukan I&apos;rab, wazan-tashrif shorof, serta unduh modul PDF rapi
          khas majelis ilmu.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-16">
          <Link
            href="/new"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest hover:bg-forest-hover text-white font-bold transition flex items-center justify-center gap-3 shadow-card border border-gold/40 text-base active:scale-95"
          >
            <span>Mulai Analisis Matan</span>
            <ArrowRight className="w-5 h-5 text-gold-light" />
          </Link>
          <Link
            href="/library"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-surface hover:bg-sandlight text-forest font-semibold transition border border-sand text-base shadow-xs"
          >
            Buka Koleksi Kajian
          </Link>
        </div>

        {/* Interactive Example Card (Manuscript Preview) */}
        <div
          id="contoh"
          className="w-full max-w-4xl text-left bg-surface rounded-3xl p-6 md:p-9 border border-sand shadow-card mb-20 relative overflow-hidden"
        >
          {/* Subtle Decorative Gold Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-30">
            <div className="w-full h-full border-t-2 border-r-2 border-gold rounded-tr-3xl"></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand pb-4 mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest bg-sandlight px-3 py-1 rounded-md border border-gold/30">
                Sampel Kajian Hadis Nabawi
              </span>
              <h3 className="font-serif font-bold text-lg md:text-xl text-forest mt-2">
                Hadis Ahli Dutsur — Shahih Muslim No. 1006
              </h3>
            </div>
            <span className="self-start sm:self-auto text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Konsonan 100% Terverifikasi</span>
            </span>
          </div>

          {/* Matan Arab Bersyakal */}
          <div className="bg-parchment-100 p-6 md:p-8 rounded-2xl border border-sand/80 shadow-inner mb-5 text-right">
            <span className="font-arabic text-2xl md:text-4xl leading-[2.4] text-forest block select-text">
              ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ ، يُصَلُّونَ كَمَا نُصَلِّي
            </span>
          </div>

          {/* Terjemah */}
          <div className="bg-sandlight p-4 rounded-xl border border-sand text-xs md:text-sm text-ink-muted mb-6 leading-relaxed">
            <strong className="text-forest text-[11px] uppercase tracking-wider block mb-1">
              Terjemah Makna:
            </strong>
            &ldquo;Orang-orang kaya telah memborong pahala yang banyak; mereka shalat sebagaimana
            kami shalat, mereka puasa sebagaimana kami puasa...&rdquo;
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto rounded-xl border border-sand">
            <table className="w-full text-xs md:text-sm border-collapse bg-surface">
              <thead>
                <tr className="bg-forest text-white font-serif">
                  <th className="p-3 text-right font-arabic text-base w-[20%]">Lafaz</th>
                  <th className="p-3 text-left w-[25%]">Arti Kata</th>
                  <th className="p-3 text-left w-[35%]">I&apos;rab Nahwu</th>
                  <th className="p-3 text-left w-[20%]">Wazan Shorof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                <tr className="hover:bg-sandlight/50 transition">
                  <td className="p-3 text-right font-arabic text-xl font-bold text-forest">
                    ذَهَبَ
                  </td>
                  <td className="p-3 text-ink-muted">Telah pergi/membawa</td>
                  <td className="p-3 text-xs leading-relaxed">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold mb-1 border border-slate-200">
                      Fi&apos;il Madhi (مبني على الفتح)
                    </span>
                    <p className="text-ink-soft">Fi&apos;il madhi mabni 'alal fathi lazim.</p>
                  </td>
                  <td className="p-3 text-xs">
                    <strong className="text-forest">فَعَلَ</strong>{' '}
                    <span className="text-ink-soft">(Bab 3 - ذ-ه-ب)</span>
                  </td>
                </tr>
                <tr className="hover:bg-sandlight/50 transition">
                  <td className="p-3 text-right font-arabic text-xl font-bold text-forest">
                    أَهْلُ
                  </td>
                  <td className="p-3 text-ink-muted">Pemilik / Orang-orang</td>
                  <td className="p-3 text-xs leading-relaxed">
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold mb-1 border border-emerald-200">
                      Fa&apos;il Marfu&apos; (فاعل مرفوع)
                    </span>
                    <p className="text-ink-soft">Fa'il marfu' dengan dhammah zhahirah, mudhaf.</p>
                  </td>
                  <td className="p-3 text-xs">
                    <strong className="text-forest">فَعْلٌ</strong>{' '}
                    <span className="text-ink-soft">(Isim Jamid)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="p-6 rounded-3xl bg-surface border border-sand shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center border border-forest/20">
              <ShieldCheck className="w-6 h-6 text-forest" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest">
              Integritas Huruf Asli 100%
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              AI tidak diperbolehkan mengubah atau menukar satu konsonan pun dari teks sumber. Hanya
              harakat syakal yang dibubuhkan dengan pengujian otomatis 2-pass.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-sand shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center border border-gold/30">
              <Scroll className="w-6 h-6 text-gold-dark" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest">
              Tafshil I&apos;rab &amp; Wazan
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Dilengkapi pemetaan kedudukan nahwu (Rafa&apos;, Nashab, Jar, Jazm, Mabni) dan wazan
              shorof lengkap dengan akar kata (root) dan shighah tashrif.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-sand shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center border border-forest/20">
              <Download className="w-6 h-6 text-forest" />
            </div>
            <h4 className="font-serif font-bold text-base text-forest">
              Ekspor PDF Format Majelis
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Cetak hasil telaah ke lembar PDF A4 landscape rapi 4 kolom berserta font naskh klasik
              Amiri berlisensi resmi, siap dibagikan ke santri &amp; jamaah.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand bg-surface/70 py-8 text-center text-xs text-ink-soft">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif font-bold text-forest">
            <span>Nahwu Studio</span>
            <span className="text-gold">•</span>
            <span className="font-normal text-ink-soft">Pinter Baca Arab</span>
          </div>
          <p>© {new Date().getFullYear()} Nahwu Studio. Khidmah Ilmu Lughah Arabiyyah.</p>
        </div>
      </footer>
    </div>
  );
}
