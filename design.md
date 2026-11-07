# Design System & Visual Architecture — PinterBacaArab

> **Versi**: 1.0  
> **Brand**: PinterBacaArab (Nahwu Studio • project by Hamdipyxis)  
> **Tujuan**: Panduan desain antarmuka, tata letak, palet warna, tipografi, dan interaksi untuk platform telaah nahwu-shorof dan bimbingan membaca naskah Arab gundul.

---

## 1. Filosofi Desain (Design Philosophy)

PinterBacaArab memadukan **keanggunan tradisi keilmuan Islam klasik (Majelis Ilmu & Halaqah)** dengan **ketepatan desain produk digital modern (High-Craft Editorial Web)**:

1. **Editorial & Scholarly (Bukan Template Generator)**:
   - Antarmuka dirancang dengan nuansa kertas berkualitas (*warm paper*), tinta gelap (*rich ink*), dan aksen hijau pinus (*cedar*) serta emas perunggu (*ochre*).
   - Menghindari kesan "AI-slop" atau gimik visual berlebih; setiap elemen memiliki kegunaan gramatikal yang nyata.

2. **Perlindungan Tipografi Naskah Arab (Tashkeel-Safe Architecture)**:
   - Font Arab klasik (seperti *Amiri*) memiliki tanda harakat atas (*fathah, tanwin, dammah, syaddah*) dan harakat bawah (*kasrah*) yang tinggi dan rendah.
   - **Aturan Wajib**: Setiap wadah teks Arab **wajib** menggunakan *line-height* longgar (`leading-[3] sm:leading-[3.2]`), *padding* vertikal cukup (`py-2` atau lebih), dan `overflow-visible` agar harakat tidak pernah terpotong (*clipped*).
   - Selalu sertakan `select-none` pada tombol/kartu kata interaktif agar peramban tidak memunculkan kotak seleksi teks warna biru bawaan yang merusak estetika naskah.

3. **Performa Ringan (Low-Resource Friendly)**:
   - Dirancang agar tetap mulus pada perangkat spesifikasi minimal (prosesor hemat daya, RAM 4GB).
   - Animasi berbasis GPU (*CSS transforms* dan *opacity*), menghindari reflow DOM yang berat, dan tidak menggunakan library 3D/canvas yang boros memori.

---

## 2. Palet Warna (Color Tokens)

Konfigurasi warna terdaftar di `tailwind.config.ts`:

### A. Latar Belakang & Permukaan (Surfaces)
| Token Tailwind | Kode Hex | Penggunaan |
| :--- | :--- | :--- |
| `bg-canvas` | `#FAFAF9` | Latar belakang dasar halaman (*warm minimal paper white*). |
| `bg-surface` | `#FFFFFF` | Latar kartu utama, panel dialog, dan dropdown. |
| `bg-subtle` | `#F4F4F2` | Latar belakang sekunder, wadah teks kutipan, hover state. |
| `border-border` | `#E7E5E4` | Garis batas struktural kartu dan pemisah konten. |
| `border-borderlight` | `#F0EFEA` | Garis batas tipis untuk tabel dan elemen sekunder. |

### B. Hirarki Tinta Teks (Ink Hierarchy)
| Token Tailwind | Kode Hex | Penggunaan |
| :--- | :--- | :--- |
| `text-ink` | `#18181B` | Teks utama, judul, teks Arab aktif (*deep near-black*). |
| `text-ink-secondary` | `#52525B` | Teks isi (*body copy*), deskripsi fitur, terjemahan. |
| `text-ink-tertiary` | `#71717A` | Teks keterangan I'rab, catatan kaki, label sekunder. |
| `text-ink-muted` | `#A1A1AA` | Metadata, nomor kata, watermark, badge netral. |

### C. Aksen Identitas Brand (Brand Accents)
| Token Tailwind | Kode Hex | Penggunaan |
| :--- | :--- | :--- |
| `cedar` (Default) | `#1B3B2B` | Warna identitas utama (*editorial deep forest pine*). Tombol CTA utama, status aktif, sorotan teks Arab. |
| `cedar-hover` | `#132A1F` | Hover state tombol utama cedar. |
| `cedar-light` | `#28543E` | Varian terang untuk aksen hover teks. |
| `cedar-soft` | `#EAF0EC` | Latar belakang badge aktif dan kartu talaqqi berhasil. |
| `ochre` (Default) | `#9A6735` | Aksen emas perunggu (*warm minimalist gold*). Mode talaqqi, petunjuk ustadz, fokus belajar. |
| `ochre-light` | `#C4945A` | Varian emas terang untuk ikon dan grafis. |
| `ochre-soft` | `#F8F3EC` | Latar belakang kartu fokus talaqqi dan petunjuk kaidah. |

### D. Warna Status Tata Bahasa (Nahwu Status Badges)
| Kedudukan / I'rab | Warna Latar | Warna Teks | Contoh Kasus |
| :--- | :--- | :--- | :--- |
| **Marfu'** (Rafa') | `bg-emerald-50/90` | `text-emerald-900` | Mubtada', Khabar, Fa'il, Na'ibul Fa'il. |
| **Manshub** (Nashab) | `bg-amber-50/90` | `text-amber-900` | Maf'ul Bih, Hal, Tamyiz, Isim Inna. |
| **Majrur** (Jarr) | `bg-rose-50/90` | `text-rose-900` | Majrur bil-Harf, Mudhaf Ilaih. |
| **Majzum** (Jazm) | `bg-sky-50/90` | `text-sky-900` | Fi'il Mudhari' kemasukan amil jawazim. |
| **Mabni** | `bg-stone-100/90` | `text-stone-700` | Fi'il Madhi, Huruf, Isim Dhamir/Isyarah. |

---

## 3. Tipografi (Typography Hierarchy)

Font diimpor melalui Google Fonts pada `globals.css`:
- **Amiri & Amiri Quran** (Arabic Naskh)
- **Newsreader** (Editorial Serif)
- **Plus Jakarta Sans** (Modern UI Sans)
- **Monospace** (Font Sistem / Code)

### A. Teks Arab (`font-arabic`)
- **Font**: `'Amiri', 'Amiri Quran', serif`
- **Direction**: `dir="rtl"`
- **Ukuran**:
  - Matan Display Hero: `text-3xl sm:text-4xl md:text-5xl`
  - Tabel Analisis / Pembedah: `text-2xl sm:text-3xl`
  - Kata Tunggal Detail: `text-2xl sm:text-3xl font-bold`
- **Line Height Wajib**: `leading-[2.8]` hingga `leading-[3.2]` (mencegah clipping harakat atas/bawah).

### B. Judul & Display (`font-serif`)
- **Font**: `'Newsreader', Georgia, serif`
- Digunakan untuk: Judul halaman (`h1`, `h2`), nama brand di navbar, dan judul kutipan kitab.
- Gaya: `font-normal tracking-tight`, aksen kata penting menggunakan `italic text-cedar`.

### C. Antarmuka & Konten Isi (`font-sans`)
- **Font**: `'Plus Jakarta Sans', -apple-system, sans-serif`
- Digunakan untuk: Tombol, teks paragraf penjelasan, navigasi, form input, dan dialog bimbingan Ustadz.

### D. Metadata & Teknis (`font-mono`)
- Digunakan untuk: Kode wazan, akar kata (`Fa-'Ain-Lam`), nomor urut hadis, persentase akurasi, dan watermark footer.

---

## 4. Bayangan & Elevasi (Shadows & Elevation)

| Nama Shadow | Nilai CSS | Penggunaan |
| :--- | :--- | :--- |
| `shadow-minimal` | `0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)` | Tombol, pill filter, kartu ringkasan kecil. |
| `shadow-float` | `0 8px 30px rgba(0, 0, 0, 0.04)` | Kartu workbench utama, panel talaqqi, modal naskah. |
| `shadow-glow` | `0 0 20px -3px rgba(27, 59, 43, 0.15)` | Tombol utama saat hover, sorotan kata aktif hijau cedar. |
| `shadow-glowOchre` | `0 0 25px -4px rgba(154, 103, 53, 0.2)` | Kartu kata yang sedang difokuskan dalam latihan talaqqi. |

---

## 5. Sistem Gerak & Animasi (Motion System)

Animasi dirancang halus, organik (*fluid*), dan tidak mengganggu keterbacaan:

1. **Easing Function Standar**:
   - `ease-fluid`: `cubic-bezier(0.16, 1, 0.3, 1)` (kurva fluid standar Apple/Linear).
   - `duration-300`: Kecepatan transisi default untuk hover dan pergantian state kata.

2. **Ambient Aurora Float (`.animate-aurora`)**:
   - Elemen blur gradien di background yang melayang perlahan (*16s infinite alternate*).
   - Memberikan kedalaman visual tanpa mengonsumsi daya CPU tinggi.

3. **Indikator Auto-Advancing Progress**:
   - Garis aksen hijau cedar tipis di bagian atas kartu workbench yang mengisi secara mulus (*linear progress* 2.8s) saat mode putar otomatis aktif.

4. **Micro-Interactions**:
   - Tombol: `active:scale-95` untuk *tactile feedback*.
   - Kartu kata: `scale-105` dan *ring glow* saat aktif terpilih.

---

## 6. Katalog Komponen Utama

### A. Bilah Navigasi (`Navbar.tsx`)
- Ketinggian tetap `h-14` (56px) dengan efek kaca *backdrop-blur-md*.
- Logo brand: `PinterBacaArab` dengan badge mono `Studio`.
- Menu navigasi berbentuk pill rounded:
  - `Latihan Baca` (dengan indikator dot ochre)
  - `Arsip Kajian`
  - `+ Kajian Baru` (tombol aksen cedar dengan ikon plus berotasi saat hover)

### B. Kartu Matan Interaktif (`MatanBoard`)
- Wadah fleksibel berarah RTL.
- Kata berstatus **Selesai / Terbuka**: Tampil dengan harakat lengkap, warna cedar, dan lencana centang mini di atasnya.
- Kata berstatus **Aktif / Fokus**: Tampil gundul dengan border ochre tebal 2px, bayangan glow ochre, dan badge *"Fokus"*.
- Kata berstatus **Masa Depan**: Tampil gundul dengan warna abu-abu transparan (`text-ink-muted/50`).

### C. Kotak Bimbingan Talaqqi Ustadz (`TalaqqiMentorBox`)
- Memiliki avatar pembimbing halaqah dengan ikon topi sarjana/kitab.
- Header peran: *"Ustadz Pembimbing Talaqqi"*.
- Pertanyaan berjenjang 2 tahap:
  1. **Tahap 1**: Menentukan kedudukan/posisi nahwu.
  2. **Tahap 2**: Menentukan harakat akhir/syakal i'rab yang benar.
- Umpan Balik Pintar:
  - **Benar (Mumtaz)**: Kartu hijau zamrud dengan ikon bintang/sparkle dan apresiasi shahih.
  - **Salah (Afwan)**: Kartu merah lembut dengan ikon tanya dan **penjelasan mendidik mengapa jawaban tersebut salah**.
- Tombol *"Minta Petunjuk Ustadz"* untuk membuka petunjuk kaidah tanpa langsung membocorkan jawaban.

### D. Footer & Watermark (`WatermarkFooter.tsx`)
- Ditampilkan di semua halaman secara konsisten.
- Format teks: `Nahwu Studio • project by Hamdipyxis • admin`.
- Tautan `admin` terhubung ke dashboard pengembang (`/dashboard`).

---

## 7. Format Cetak Modul PDF (A4 Landscape Majelis)

PinterBacaArab memiliki generator PDF resmi berbasis Puppeteer headless:
- **Ukuran Kertas**: A4 Landscape (`297mm x 210mm`).
- **Margin**: 15mm di seluruh sisi.
- **Header**: Judul kajian, nomor hadis, dan tanggal masehi/hijriah.
- **Tabel 4 Kolom**:
  1. *Lafaz Bersyakal* (Amiri 20pt, RTL)
  2. *Arti Kata / Terjemahan* (10pt Sans)
  3. *Kedudukan Nahwu & Tanda I'rab* (10pt Sans)
  4. *Wazan & Akar Kata Shorof* (10pt Serif/Arabic)
- **Footer Cetak**: Watermark *"PinterBacaArab — Nahwu Studio • project by Hamdipyxis"*.

---

## 8. Panduan Pengembang (Developer Rules)

1. **Jangan Pernah Mengubah Konsonan Teks Arab**: Pipeline hanya menambahkan harakat/syakal, huruf dasar harus 100% identik dengan teks asli.
2. **Hindari Hardcode Warna Manual**: Selalu gunakan token Tailwind yang sudah terdefinisi (`bg-canvas`, `text-ink`, `bg-cedar`, `text-ochre`, `border-border`).
3. **Selalu Beri Ruang Harakat Vertikal**: Setiap render teks Arab wajib memiliki `leading-[2.8]` ke atas dan `overflow-visible`.
4. **Isolasi Pengguna**: Setiap penambahan fitur penyimpanan data harus terikat dengan cookie `pba_user_id` agar data pengguna tidak tercampur secara global.
