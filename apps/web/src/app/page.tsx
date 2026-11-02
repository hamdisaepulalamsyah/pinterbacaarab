import Link from 'next/link';
import { BookOpen, Sparkles, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-bgwarm text-ink">
      {/* Navbar */}
      <header className="border-b border-sand bg-surface/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-forest flex items-center justify-center text-white font-arabic text-2xl font-bold shadow-sm">
              ن
            </div>
            <div>
              <span className="font-bold text-lg text-forest tracking-tight block leading-tight">
                Nahwu Studio
              </span>
              <span className="text-xs text-gold-dark font-medium">
                Pinter Baca Arab & Analisis Hadis
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/library"
              className="text-sm font-medium text-ink hover:text-forest transition"
            >
              Dokumen Saya
            </Link>
            <Link
              href="/new"
              className="px-4 py-2 rounded-lg bg-forest hover:bg-forest-hover text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analisis Baru</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand text-forest text-xs font-semibold mb-6 border border-gold/30">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
          <span>Didukung AI Gemini 3.8 & Validasi 100% Konsonan Identik</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-forest max-w-3xl leading-tight md:leading-tight mb-6">
          Ubah Teks Arab Gundul Menjadi{' '}
          <span className="text-gold-dark underline decoration-gold/40">Kajian Nahwu-Shorof</span>{' '}
          Siap Cetak
        </h1>

        <p className="text-base md:text-lg text-ink/75 max-w-2xl mb-10 leading-relaxed">
          Ketik atau tempel teks hadis & kitab. Dapatkan harakat bersyakal presisi, terjemah
          Indonesia per kata, bedah I&apos;rab nahwu lengkap, wazan dan tashrif shorof, serta ekspor
          PDF format kajian rapi.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/new"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-forest hover:bg-forest-hover text-white font-semibold transition flex items-center justify-center gap-3 shadow-md shadow-forest/20 text-base"
          >
            <span>Mulai Analisis Dokumen</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#contoh"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface hover:bg-sand text-forest font-semibold transition border border-sand text-base"
          >
            Lihat Contoh Hasil
          </a>
        </div>

        {/* Contoh Kartu Interaktif */}
        <div
          id="contoh"
          className="w-full max-w-4xl text-left bg-surface rounded-2xl p-6 md:p-8 border border-sand shadow-sm mb-16"
        >
          <div className="flex items-center justify-between border-b border-sand pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest bg-sand px-2.5 py-1 rounded">
                Contoh Hasil Kajian Hadis
              </span>
              <h3 className="font-bold text-lg text-ink mt-2">Hadis Abu Dzar — Shahih Muslim</h3>
            </div>
            <span className="text-xs text-forest-light bg-forest/10 px-2 py-1 rounded-full font-medium">
              100% Lolos Validasi Konsonan
            </span>
          </div>

          <div className="bg-bgwarm p-5 rounded-xl border-r-4 border-forest mb-4 text-right">
            <span className="font-arabic text-2xl md:text-3xl leading-loose text-ink">
              ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ
            </span>
          </div>

          <p className="text-sm text-ink/80 mb-6 bg-sand/40 p-3 rounded-lg">
            <strong>Terjemah:</strong> Orang-orang kaya (pemilik harta melimpah) telah memborong
            pahala.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-forest text-white">
                  <th className="p-3 text-right font-arabic text-base">Lafaz</th>
                  <th className="p-3 text-left">Arti Per Kata</th>
                  <th className="p-3 text-left">I&apos;rab Nahwu</th>
                  <th className="p-3 text-left">Shorof (Wazan / Akar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                <tr className="hover:bg-bgwarm/50">
                  <td className="p-3 text-right font-arabic text-lg font-bold text-forest">
                    ذَهَبَ
                  </td>
                  <td className="p-3">telah pergi / memborong</td>
                  <td className="p-3 text-ink/90">Fi&apos;il madhi mabni atas fathah zhahirah</td>
                  <td className="p-3 text-xs text-ink/75">فَعَلَ (ذ-ه-ب) — Tsulatsi Mujarrad</td>
                </tr>
                <tr className="hover:bg-bgwarm/50">
                  <td className="p-3 text-right font-arabic text-lg font-bold text-forest">
                    أَهْلُ
                  </td>
                  <td className="p-3">pemilik / kaum</td>
                  <td className="p-3 text-ink/90">Fa&apos;il marfu&apos; dengan dhammah, mudhaf</td>
                  <td className="p-3 text-xs text-ink/75">فَعْلٌ (أ-ه-ل) — Isim Jamid</td>
                </tr>
                <tr className="hover:bg-bgwarm/50">
                  <td className="p-3 text-right font-arabic text-lg font-bold text-forest">
                    الدُّثُورِ
                  </td>
                  <td className="p-3">harta yang melimpah</td>
                  <td className="p-3 text-ink/90">Mudhaf ilaih majrur dengan kasrah</td>
                  <td className="p-3 text-xs text-ink/75">فُعُولٌ (د-ث-ر) — Jamak Taksir</td>
                </tr>
                <tr className="hover:bg-bgwarm/50">
                  <td className="p-3 text-right font-arabic text-lg font-bold text-forest">
                    بِالْأُجُورِ
                  </td>
                  <td className="p-3">dengan pahala-pahala</td>
                  <td className="p-3 text-ink/90">Jar-majrur, muta&apos;alliq dengan dzahaba</td>
                  <td className="p-3 text-xs text-ink/75">فُعُولٌ (أ-ج-ر) — Jamak dari أَجْرٌ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Pilar Fitur Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-surface p-6 rounded-2xl border border-sand">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-forest text-base mb-2">Integritas Huruf 100%</h4>
            <p className="text-sm text-ink/70 leading-relaxed">
              Algoritma verifikasi otomatis memastikan konsonan teks sumber pengguna tidak boleh
              diubah atau dikurangi sama sekali oleh AI.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-sand">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-forest text-base mb-2">Editor Sel Interaktif</h4>
            <p className="text-sm text-ink/70 leading-relaxed">
              Setiap hasil AI bisa dikoreksi secara inline. Sel yang memiliki tingkat keyakinan
              rendah akan disorot untuk diperiksa ustadz atau dosen.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-sand">
            <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-forest text-base mb-2">Ekspor PDF Format Kajian</h4>
            <p className="text-sm text-ink/70 leading-relaxed">
              Cetak modul kajian kitab berukuran A4 Landscape rapi dengan tipografi Arab Amiri yang
              tersambung sempurna dan tata letak akademis.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand bg-surface py-6 text-center text-xs text-ink/60">
        <div className="max-w-6xl mx-auto px-4">
          <p>
            © 2026 Nahwu Studio. Dirancang untuk mahasiswa ilmu hadis, santri, dan pengajar bahasa
            Arab.
          </p>
        </div>
      </footer>
    </div>
  );
}
