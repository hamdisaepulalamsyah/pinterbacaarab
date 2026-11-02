# NAHWU STUDIO — PROJECT BRIEF (SATU FILE)

> Untuk agent (Antigravity): file ini adalah satu-satunya sumber kebenaran proyek. Setiap rujukan ke "docs/01…06" atau "TRD §5", "UI/UX Brief §5", "App Flow §7" berarti bagian bernomor yang sama di dalam file ini. Simpan file ini sebagai `PROJECT_BRIEF.md` di root repo. Ekstrak Lampiran A menjadi `AGENTS.md` dan Lampiran B–C menjadi `apps/worker/prompts/analyze.md` dan `apps/worker/prompts/review.md` pada Fase 0/3.

## Daftar Isi

1. PRD
2. TRD
3. App Flow
4. UI/UX Design Brief
5. Backend Schema
6. Implementation Plan

- Lampiran A: AGENTS.md
- Lampiran B: Prompt sistem analisis (Pass A)
- Lampiran C: Prompt review (Pass B)

---

# PRD — Nahwu Studio (nama kerja)

## 1. Ringkasan

Web app yang mengubah teks Arab gundul (pendek maupun panjang) menjadi PDF kajian yang rapi: teks bersyakal, terjemah Indonesia, tabel per kata (arti, i'rab nahwu, tashrif/wazan shorof). Diproses AI melalui 9router milik sendiri di VPS.

## 2. Masalah

- Mahasiswa kesulitan membaca teks Arab gundul.
- Analisis nahwu, shorof, dan terjemah per kata dibuat manual: lama, melelahkan, rawan tidak konsisten.

## 3. Target Pengguna

- Utama: mahasiswa ilmu hadis/syariah/bahasa Arab (teman sekelas pembuat).
- Sekunder: santri, pengajar, penulis kajian kitab.

## 4. Tujuan & Metrik

| Tujuan                  | Metrik                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| Hasil cepat             | 1 paragraf (~100 kata) < 60 detik                                 |
| Teks asli tidak berubah | 100% konsonan identik setelah harakat dibuang (validasi otomatis) |
| Output rapi             | PDF A4, Arab tidak terputus/terbalik, tabel tidak terpotong       |
| Bisa dikoreksi          | Setiap sel hasil bisa diedit sebelum ekspor                       |

## 5. Fitur MVP (P0)

1. Input teks Arab (paste / ketik), hitung kata, batas panjang per job.
2. Opsi: judul dokumen, nama kitab/sumber, tingkat detail (ringkas: arti saja; lengkap: arti + nahwu + shorof).
3. Pemrosesan AI otomatis: segmentasi, syakal, terjemah, analisis per kata.
4. Validasi otomatis + penanda "perlu dicek" pada kata yang tidak lolos / berkeyakinan rendah.
5. Pratinjau hasil + editor sel (inline edit).
6. Ekspor PDF bergaya kajian (mirip contoh): cover judul, segmen, terjemah, tabel 4 kolom.
7. Riwayat dokumen (login) dan unduh ulang.

## 6. Fitur P1

- Ekspor DOCX, bagikan lewat link read-only.
- Regenerate per segmen / per kata.
- Glosarium istilah konsisten (mis. "shalawat" selalu sama).
- Mode gelap di pratinjau.

## 7. Di Luar Lingkup (MVP)

- OCR dari gambar/PDF kitab, aplikasi mobile native, kolaborasi realtime, tafsir/syarah otomatis.

## 8. Kebutuhan Non-Fungsional

- Keakuratan > kecepatan. Pengguna diberi peringatan bahwa hasil AI wajib diverifikasi.
- Bahasa UI: Indonesia. Teks Arab RTL benar.
- Biaya: stack gratis (Vercel, Supabase free) + VPS yang sudah ada.

## 9. Risiko

| Risiko                | Mitigasi                                                                         |
| --------------------- | -------------------------------------------------------------------------------- |
| AI keliru i'rab/wazan | Prompt terstruktur, validasi skema, pass review kedua, editor manual, disclaimer |
| AI mengubah teks asli | Cek konsonan identik, auto-retry segmen                                          |
| PDF Arab rusak        | Render via Chromium (HTML→PDF) dengan font Arab, bukan library canvas            |
| Teks panjang timeout  | Chunking + antrean job di worker VPS                                             |

## 10. Kriteria Sukses MVP

Teks contoh 22 halaman kajian dapat direproduksi dengan struktur setara dan seluruh kata lolos validasi konsonan.

---

# TRD — Nahwu Studio

## 1. Arsitektur

```
[Browser] → [Next.js di Vercel] → [Supabase: Auth + Postgres]
                                        ↑ (poll / claim job)
                              [Worker Node di VPS]
                                 ├─ LLM via 9router (OpenAI-compatible)
                                 └─ PDF via Playwright/Chromium
```

Alasan worker di VPS: Vercel gratis punya batas durasi fungsi; job AI panjang dan Chromium lebih aman di VPS.

## 2. Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Zustand/React Query.
- DB/Auth: Supabase (Postgres, RLS, Auth email/Google).
- Worker: Node 20 + Fastify (health & trigger), loop pengambil job.
- LLM: 9router endpoint OpenAI-compatible `POST {NINEROUTER_BASE_URL}/v1/chat/completions`.
- PDF: Playwright Chromium, HTML template + CSS Paged Media.
- Validasi: Zod. Tes: Vitest + Playwright e2e.

## 3. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # hanya worker
NINEROUTER_BASE_URL=            # mis. https://router.domainmu.com
NINEROUTER_API_KEY=
LLM_MODEL=                      # isi nama model persis seperti terdaftar di 9router
LLM_MODEL_REVIEW=               # opsional, boleh sama
WORKER_SHARED_SECRET=
```

Nama model jangan di-hardcode; baca dari env agar mudah ganti.

## 4. Pipeline Pemrosesan (di worker)

1. **Normalisasi**: trim, satukan spasi, buang tatweel, simpan `source_text`.
2. **Segmentasi**: pecah per kalimat/tanda baca, tiap chunk ≤ ~120 kata, jaga konteks (kirim 1 segmen sebelum & sesudah sebagai konteks, tidak dianalisis ulang).
3. **Pass A (analisis)**: per segmen, minta JSON ketat (lihat §5). `temperature` rendah (0–0.2), `response_format` JSON bila didukung.
4. **Validasi**:
   - Skema Zod lolos.
   - `strip_harakat(arabic_vocalized) === strip_harakat(source_segment)` (setelah normalisasi). Gagal → retry maks 2x, lalu tandai `needs_review`.
   - Jumlah `words` sama dengan jumlah token sumber.
5. **Pass B (review)**: model memeriksa i'rab/wazan, mengembalikan koreksi + `confidence` per kata. Kata `confidence < 0.7` ditandai.
6. **Simpan** per segmen ke DB, update progres job.
7. **Ekspor PDF** (job terpisah): render HTML → PDF → simpan ke Supabase Storage.

## 5. Kontrak Data Output AI (per segmen)

```json
{
  "title": "string|null",
  "arabic_vocalized": "string",
  "translation_id": "string",
  "words": [
    {
      "ar": "string", // satu lafaz bersyakal
      "meaning_id": "string",
      "nahwu": "string", // i'rab lengkap, istilah standar
      "sharf": {
        "root": "string|null",
        "wazan": "string|null",
        "tashrif": "string|null",
        "note": "string|null"
      },
      "confidence": 0.0
    }
  ]
}
```

## 6. Prompt Sistem (ringkas)

- Peran: ahli nahwu-shorof berbahasa Indonesia.
- Aturan keras: jangan menambah/mengurangi/mengubah huruf asli; hanya menambah harakat; satu entri per lafaz; istilah i'rab baku; keluaran hanya JSON.
- Sertakan 2 contoh few-shot dari PDF contoh. Simpan prompt di `worker/prompts/*.md` agar mudah diubah.

## 7. API (Next.js route handlers)

| Method | Path                          | Fungsi                     |
| ------ | ----------------------------- | -------------------------- |
| POST   | /api/documents                | buat dokumen + job proses  |
| GET    | /api/documents/:id            | dokumen + segmen + status  |
| PATCH  | /api/words/:id                | edit sel                   |
| POST   | /api/documents/:id/regenerate | regenerate segmen terpilih |
| POST   | /api/documents/:id/export     | buat job ekspor PDF        |
| GET    | /api/jobs/:id                 | status & progres           |

Worker mengambil job dengan `select ... for update skip locked` (via RPC `claim_job`).

## 8. Keamanan

- RLS: pengguna hanya akses dokumennya.
- Service role key hanya di worker. API key 9router tidak pernah ke browser.
- Rate limit per pengguna (mis. 20 job/hari, 3000 kata/job).
- Sanitasi input; render PDF dari data terstruktur, bukan HTML mentah dari pengguna.

## 9. PDF

- Font Arab: Amiri atau Scheherazade New (embed lokal). Latin: Noto Sans.
- `direction: rtl` pada sel Arab, `unicode-bidi: isolate`.
- `table { page-break-inside: auto } tr { page-break-inside: avoid }`, header tabel berulang.
- Footer nomor halaman "Halaman X dari Y".

## 10. Observabilitas & Tes

- Log terstruktur di worker, simpan `error` & `attempts` di tabel job.
- Tes unit: strip_harakat, chunking, validator. Tes e2e: input contoh → PDF terbentuk, jumlah halaman > 0.

---

# App Flow — Nahwu Studio

## 1. Peta Halaman

- `/` Landing + contoh hasil
- `/login`
- `/new` Buat dokumen
- `/d/[id]` Pratinjau & editor
- `/d/[id]/export` Ekspor
- `/library` Riwayat dokumen
- `/settings` Preferensi (detail default, ukuran font)

## 2. Alur Utama (happy path)

1. Pengguna login → `/library` (kosong) → tombol "Dokumen Baru".
2. `/new`: tempel teks Arab, isi judul & sumber, pilih detail (Ringkas/Lengkap) → "Proses".
3. Validasi klien: teks tidak kosong, mengandung huruf Arab, ≤ batas kata.
4. POST `/api/documents` → dialihkan ke `/d/[id]` dengan status **Memproses**.
5. Halaman melakukan polling `/api/jobs/:id` tiap 2 detik: progres "Segmen 3 dari 12".
6. Segmen yang selesai tampil bertahap (streaming-like).
7. Selesai → pengguna memeriksa; sel bertanda ⚠ perlu dicek disorot.
8. Edit sel inline (klik → ubah → simpan otomatis).
9. "Ekspor PDF" → job ekspor → tombol Unduh aktif.

## 3. Alur Alternatif

- **Segmen gagal validasi**: ditampilkan dengan label ⚠ + tombol "Coba lagi segmen ini".
- **Job gagal total** (9router mati): pesan jelas + tombol "Ulangi"; dokumen tidak hilang.
- **Teks terlalu panjang**: pesan batas; tawarkan memecah manual.
- **Belum login**: boleh coba teks ≤ 100 kata tanpa simpan (opsional P1).
- **Hapus dokumen**: konfirmasi dialog.

## 4. Diagram Status Dokumen

`draft → queued → processing → needs_review | ready → exporting → exported`
Kegagalan: `processing → failed` (dapat diulang ke `queued`).

## 5. Diagram Status Job

`pending → running → done | failed` (retry menaikkan `attempts`, maks 3).

## 6. Interaksi Editor

- Klik sel → mode edit; Enter simpan, Esc batal.
- Tombol per baris: "Regenerate kata" (P1), "Tandai sudah dicek".
- Filter: "Hanya yang perlu dicek".
- Toggle kolom: tampilkan/sembunyikan Nahwu, Shorof.

## 7. Empty / Loading / Error States

Setiap halaman wajib punya ketiganya; skeleton tabel saat memuat; toast untuk simpan/ekspor.

---

# UI/UX Design Brief — Nahwu Studio

## 1. Prinsip

- **Keterbacaan teks Arab nomor satu**: besar, lega, kontras tinggi.
- Tenang dan akademis, bukan ramai. Mobile-first (pengguna sering dari HP).
- Setiap hasil AI terlihat "bisa dikoreksi".

## 2. Nuansa Visual

- Warna: krem hangat `#FAF6EE` (latar), hijau tua `#1F4D3A` (aksen utama), emas lembut `#B8913B` (sorotan/judul), teks `#1C1C1C`; peringatan `#C2410C`.
- Mode gelap: latar `#14181A`, teks `#EDEDED`, aksen hijau terang `#5BBF93`.
- Sudut membulat sedang (10–12px), bayangan tipis.

## 3. Tipografi

- Arab: **Amiri** (judul & teks syakal), ukuran dasar 24–28px, line-height 2.0.
- Latin: **Inter** atau Noto Sans, 15–16px.
- Istilah transliterasi dicetak miring.

## 4. Komponen Utama

1. **Input Area**: textarea besar RTL, penghitung kata, tombol Proses menempel di bawah pada mobile.
2. **Kartu Segmen**: nomor/judul segmen → blok Arab bersyakal (kotak berlatar lembut) → blok "Terjemah" → tabel kata.
3. **Tabel Kata** (desktop): 4 kolom — Lafaz | Arti per kata | Analisis Nahwu (I'rab) | Analisis Shorof. Header lengket.
4. **Tampilan Mobile**: tiap kata menjadi kartu bertumpuk (Lafaz besar di atas, lalu tiga baris berlabel) — hindari tabel 4 kolom di layar sempit.
5. **Badge Status**: "Perlu dicek" (oranye), "Sudah dicek" (hijau).
6. **Progress Bar** pemrosesan dengan teks "Segmen X dari Y".
7. **Panel Ekspor**: pilih ukuran font Arab, tampilkan kolom, orientasi (potret/lanskap), lalu Unduh.

## 5. Desain PDF (acuan: contoh kajian)

- Judul kitab & bab di tengah, ornamen garis tipis emas.
- Per segmen: subjudul "Segmen N: …", blok Arab, blok "Terjemah:", lalu tabel.
- Tabel: header hijau tua teks putih, baris selang-seling krem, border tipis.
- Footer: judul kajian + "Halaman X dari Y". Margin 18mm.
- Default lanskap agar tabel 4 kolom lega.

## 6. Aksesibilitas

- Kontras minimal WCAG AA, fokus keyboard terlihat, ukuran target sentuh ≥ 44px.
- `lang="ar"` dan `dir="rtl"` pada konten Arab, `lang="id"` pada selebihnya.

## 7. Mikrocopy (contoh)

- Disclaimer: "Hasil dibuat AI. Mohon verifikasi dengan kitab/ustadz sebelum dipakai."
- Gagal: "Segmen ini belum lolos pemeriksaan. Coba lagi atau edit manual."

## 8. Deliverable untuk Agent

Buat design tokens (`tokens.css`/Tailwind config), halaman `/new`, `/d/[id]`, `/library`, serta template HTML PDF. Cek tampilan di lebar 375px, 768px, 1280px.

---

# Backend Schema — Nahwu Studio (Supabase / Postgres)

## 1. Tabel

```sql
create extension if not exists "pgcrypto";

create type doc_status as enum
  ('draft','queued','processing','needs_review','ready','exporting','exported','failed');
create type job_kind as enum ('process','regenerate','export');
create type job_status as enum ('pending','running','done','failed');
create type detail_level as enum ('brief','full');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  daily_quota int not null default 20,
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_name text,
  source_text text not null,
  detail detail_level not null default 'full',
  status doc_status not null default 'draft',
  word_count int not null default 0,
  pdf_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table segments (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  position int not null,
  source_text text not null,
  title text,
  arabic_vocalized text,
  translation_id text,
  status text not null default 'pending',  -- pending|ok|needs_review|failed
  error text,
  unique (document_id, position)
);

create table words (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references segments(id) on delete cascade,
  position int not null,
  ar text not null,
  meaning_id text,
  nahwu text,
  sharf_root text,
  sharf_wazan text,
  sharf_tashrif text,
  sharf_note text,
  confidence numeric(3,2),
  checked boolean not null default false,
  edited boolean not null default false,
  unique (segment_id, position)
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind job_kind not null,
  status job_status not null default 'pending',
  progress_done int not null default 0,
  progress_total int not null default 0,
  attempts int not null default 0,
  payload jsonb,
  error text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index on documents (user_id, created_at desc);
create index on segments (document_id, position);
create index on words (segment_id, position);
create index on jobs (status, created_at);
```

## 2. Fungsi Klaim Job (worker)

```sql
create or replace function claim_job() returns jobs
language plpgsql security definer as $$
declare j jobs;
begin
  select * into j from jobs
   where status = 'pending'
   order by created_at
   for update skip locked limit 1;
  if found then
    update jobs set status='running', started_at=now(), attempts=attempts+1
     where id = j.id returning * into j;
  end if;
  return j;
end $$;
```

## 3. Trigger `updated_at`

```sql
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end $$ language plpgsql;
create trigger t_docs_touch before update on documents
for each row execute function touch_updated_at();
```

## 4. Row Level Security

```sql
alter table profiles  enable row level security;
alter table documents enable row level security;
alter table segments  enable row level security;
alter table words     enable row level security;
alter table jobs      enable row level security;

create policy own_profile on profiles for all using (id = auth.uid());
create policy own_docs on documents for all using (user_id = auth.uid());
create policy own_jobs on jobs for select using (user_id = auth.uid());
create policy own_segments on segments for all using (
  exists (select 1 from documents d where d.id = document_id and d.user_id = auth.uid()));
create policy own_words on words for all using (
  exists (select 1 from segments s join documents d on d.id = s.document_id
          where s.id = segment_id and d.user_id = auth.uid()));
```

Worker memakai service role (melewati RLS).

## 5. Storage

Bucket privat `exports`; path `userId/documentId/nama-file.pdf`; unduh via signed URL 10 menit.

## 6. Kuota

Cek di API sebelum membuat job: hitung `jobs` hari ini per pengguna ≤ `profiles.daily_quota`; tolak bila `word_count` > 3000.

---

# Implementation Plan — Nahwu Studio (untuk Antigravity)

## Aturan Kerja Agent

- Baca dulu `docs/01`–`docs/05` sebelum menulis kode apa pun.
- Kerjakan per fase; setiap fase selesai harus lulus: `npm run lint`, `npm run typecheck`, `npm test`, lalu commit dengan pesan jelas.
- Jangan ubah kontrak data di TRD §5 tanpa memperbarui dokumen.
- Jangan hardcode kunci/nama model; semua dari `.env`. Sediakan `.env.example`.
- Berhenti dan lapor bila butuh keputusan manusia (kredensial, domain, pilihan desain besar).

## Struktur Repo

```
/apps/web        Next.js
/apps/worker     Node worker + PDF
/packages/shared tipe, skema Zod, strip_harakat
/docs            enam dokumen ini
/supabase        migrations
```

## Fase 0 — Fondasi

- Monorepo (pnpm workspaces), TypeScript, ESLint, Prettier, Vitest.
- Buat `.env.example`. Tambah `AGENTS.md` berisi Aturan Kerja di atas.
- **Selesai bila**: `pnpm install && pnpm test` hijau.

## Fase 1 — Database

- Terjemahkan `docs/05` menjadi file migrasi Supabase; terapkan lokal/proyek.
- Tes RLS: pengguna A tidak bisa baca dokumen pengguna B.
- **Selesai bila**: migrasi jalan dan tes RLS lulus.

## Fase 2 — Paket Shared

- Skema Zod (kontrak TRD §5), `stripHarakat`, `normalizeArabic`, `chunkSegments`.
- Tes unit dengan potongan teks dari PDF contoh (mis. hadis "dzahaba ahlud-dutsuur…").
- **Selesai bila**: cakupan tes fungsi inti ≥ 90%.

## Fase 3 — Klien LLM 9router

- Modul `llm.ts`: panggilan OpenAI-compatible, timeout, retry exponential, parse JSON aman, baca env.
- Prompt di `apps/worker/prompts/` (analisis & review) dengan few-shot.
- Mode mock untuk tes tanpa jaringan.
- **Selesai bila**: tes dengan mock lulus + skrip `pnpm llm:smoke` memanggil 9router sungguhan dan mencetak JSON valid untuk 1 kalimat.

## Fase 4 — Pipeline Worker

- Loop `claim_job` → proses → simpan segmen/kata → update progres.
- Validator konsonan identik, retry maks 2, penanda `needs_review`.
- Pass review & `confidence`.
- **Selesai bila**: 1 teks contoh (≥ 5 segmen) terproses end-to-end ke DB.

## Fase 5 — Ekspor PDF

- Template HTML/CSS (UI/UX Brief §5), font Arab dibundel lokal.
- Playwright → PDF, unggah ke Storage, simpan `pdf_path`.
- Tes visual: render teks contoh, cek PDF ≥ 1 halaman, ekstrak teks Arab tidak kosong, tangkapan layar untuk review manusia.
- **Selesai bila**: PDF contoh terbentuk, Arab tersambung & RTL benar.

## Fase 6 — Web App

- Auth Supabase, halaman `/login`, `/library`, `/new`, `/d/[id]`.
- Polling job, tampilan segmen bertahap, editor sel, filter "perlu dicek".
- Responsif: tabel desktop, kartu mobile.
- **Selesai bila**: alur happy path TRD/App Flow berjalan dengan teks contoh.

## Fase 7 — Ekspor & Polesan

- Panel ekspor (font, kolom, orientasi), unduh via signed URL.
- Kuota & rate limit, disclaimer, empty/loading/error states, mode gelap.
- **Selesai bila**: semua checklist App Flow §7 terpenuhi.

## Fase 8 — Deploy

- Web → Vercel. Worker → VPS (Docker atau pm2, auto-restart), `WORKER_SHARED_SECRET`, firewall hanya keluar ke Supabase & 9router.
- Skrip health check dan README deploy.
- **Selesai bila**: pengguna di produksi bisa input teks lalu mengunduh PDF.

## Fase 9 — Evaluasi Kualitas

- Kumpulkan 10 teks uji dengan kunci jawaban dari dosen/ustadz.
- Ukur: persentase konsonan identik (target 100%), akurasi i'rab per kata (catat), kata ber-confidence rendah.
- Sesuaikan prompt berdasarkan temuan.

## Prompt Pembuka untuk Antigravity

> Baca semua file di `/docs` dan `AGENTS.md`. Kerjakan Implementation Plan mulai Fase 0 secara berurutan. Setelah tiap fase, jalankan lint, typecheck, dan tes, perbaiki sampai hijau, commit, lalu ringkas hasil dalam 3 kalimat dan lanjut ke fase berikutnya. Berhenti hanya jika butuh kredensial atau keputusan dariku.

## Yang Harus Disiapkan Manusia

1. Proyek Supabase (URL + anon + service key).
2. `NINEROUTER_BASE_URL`, API key, dan nama model persis di 9router.
3. Akses SSH ke VPS untuk deploy worker.
4. Akun Vercel dan repo GitHub.

---

---

# Lampiran A — AGENTS.md

```markdown
# AGENTS.md

- Baca PROJECT_BRIEF.md sebelum mengubah kode apa pun.
- Kerjakan per fase sesuai Implementation Plan. Tiap fase: lint, typecheck, test hijau → commit → ringkas 3 kalimat → lanjut.
- Jangan hardcode kunci API, URL, atau nama model; semua dari .env. Perbarui .env.example bila menambah variabel.
- Jangan ubah kontrak data (TRD §5) atau skema DB tanpa memperbarui PROJECT_BRIEF.md dan migrasi.
- Teks Arab milik pengguna tidak boleh diubah hurufnya oleh pipeline; hanya harakat yang boleh ditambahkan.
- Jangan menyimpan teks pengguna ke log produksi.
- Berhenti dan tanya manusia hanya bila butuh kredensial, akses server, atau keputusan desain besar.
- Setiap fitur baru wajib punya tes; bug wajib punya tes regresi.
```

---

# Lampiran B — Prompt Sistem Analisis (Pass A)

Simpan sebagai `apps/worker/prompts/analyze.md`. Variabel: `{{detail}}` (brief|full), `{{prev_context}}`, `{{next_context}}`, `{{segment}}`.

```markdown
Kamu adalah ahli nahwu dan shorof yang mengajar mahasiswa Indonesia. Tugasmu menganalisis SATU segmen teks Arab klasik.

## Aturan keras

1. Jangan menambah, mengurangi, mengganti, atau mengurutkan ulang HURUF/KATA pada teks sumber. Kamu hanya boleh menambahkan harakat (syakal) dan tanda tasydid/tanwin yang diperlukan.
2. Satu entri `words` untuk setiap lafaz pada teks sumber, sesuai urutan. Huruf yang menempel (و، ف، ب، ل، ك، ال) tetap satu lafaz kecuali sumber memisahkannya dengan spasi.
3. Beri syakal sesuai konteks kalimat dan ilmu nahwu. Bila ada dua bacaan yang sah dan konteks tidak menentukan, pilih yang paling umum dan jelaskan alternatifnya di `nahwu` atau `sharf.note`.
4. Gunakan istilah i'rab baku: mubtada', khabar, fa'il, maf'ul bih, na'at, mudhaf, mudhaf ilaih, jar-majrur, muta'alliq, 'athaf, hal, tamyiz, badal, dst. Sebut tanda i'rab (dhammah, fathah, kasrah, sukun, nun, alif, ya', wawu) dan status (zhahirah/muqaddarah, mabni/mu'rab).
5. Untuk shorof pada fi'il: sebutkan jenis (tsulatsi/ruba'i, mujarrad/mazid, shahih/mu'tal), akar kata, wazan, dan tashrif ringkas (madhi - mudhari' - masdar). Untuk isim: jenis (masdar, isim fa'il, isim maf'ul, jamid, dst.), wazan, dan bentuk jamak bila relevan. Untuk huruf: cukup sebut jenisnya.
6. Terjemah Indonesia harus natural, setia pada makna, tanpa menambah tafsir yang tidak ada di teks. `meaning_id` per kata singkat dan sesuai konteks.
7. Jika tidak yakin, turunkan `confidence` (0–1) dan jujur di `note`; JANGAN mengarang.
8. `detail = brief`: isi `meaning_id` saja; `nahwu` dan `sharf` boleh null. `detail = full`: isi semua.
9. Keluarkan HANYA JSON valid sesuai skema, tanpa markdown dan tanpa teks lain.

## Skema keluaran

{
"title": string|null,
"arabic_vocalized": string,
"translation_id": string,
"words": [
{
"ar": string,
"meaning_id": string,
"nahwu": string|null,
"sharf": { "root": string|null, "wazan": string|null, "tashrif": string|null, "note": string|null },
"confidence": number
}
]
}

## Contoh (full)

Sumber: ذهب أهل الدثور بالأجور
Keluaran:
{
"title": null,
"arabic_vocalized": "ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ",
"translation_id": "Orang-orang pemilik harta banyak telah memborong pahala.",
"words": [
{"ar":"ذَهَبَ","meaning_id":"pergi / memborong","nahwu":"Fi'il madhi mabni atas fathah zhahirah.","sharf":{"root":"ذ-ه-ب","wazan":"فَعَلَ","tashrif":"ذَهَبَ - يَذْهَبُ - ذَهَابًا","note":"Fi'il tsulatsi mujarrad shahih salim."},"confidence":0.97},
{"ar":"أَهْلُ","meaning_id":"pemilik / ahli","nahwu":"Fa'il marfu' dengan dhammah zhahirah, dan menjadi mudhaf.","sharf":{"root":"أ-ه-ل","wazan":"فَعْلٌ","tashrif":"jamak: أَهْلُونَ / أَهَالٍ","note":null},"confidence":0.95},
{"ar":"الدُّثُورِ","meaning_id":"harta-harta yang banyak","nahwu":"Mudhaf ilaih majrur dengan kasrah zhahirah.","sharf":{"root":"د-ث-ر","wazan":"فُعُولٌ","tashrif":"jamak taksir dari دَثْرٌ","note":null},"confidence":0.93},
{"ar":"بِالْأُجُورِ","meaning_id":"dengan pahala-pahala","nahwu":"Ba': huruf jar. Al-ujur: isim majrur dengan kasrah, muta'alliq dengan dzahaba.","sharf":{"root":"أ-ج-ر","wazan":"فُعُولٌ","tashrif":"jamak taksir dari أَجْرٌ","note":null},"confidence":0.94}
]
}

## Konteks (jangan dianalisis ulang, hanya untuk memahami kalimat)

Sebelumnya: {{prev_context}}
Sesudahnya: {{next_context}}

## Detail: {{detail}}

## Segmen yang dianalisis
{{segment}}
```

---

# Lampiran C — Prompt Review (Pass B)

Simpan sebagai `apps/worker/prompts/review.md`. Variabel: `{{segment_source}}`, `{{analysis_json}}`.

```markdown
Kamu adalah pemeriksa kedua (muraji') untuk analisis nahwu-shorof. Periksa JSON analisis terhadap teks sumber.

Periksa per kata:

- Syakal sesuai konteks dan kaidah.
- I'rab (kedudukan, tanda, mabni/mu'rab) benar dan konsisten dengan kata lain dalam kalimat.
- Jenis kata, akar, wazan, dan tashrif benar.
- Arti per kata dan terjemah sesuai konteks.

Aturan:

1. Jangan mengubah huruf teks sumber. Hanya koreksi harakat dan isi analisis.
2. Perbaiki hanya yang jelas salah. Bila hanya beda pendapat ulama yang sama-sama sah, biarkan dan tambahkan catatan singkat di `note`.
3. Turunkan `confidence` bila kamu ragu; naikkan hanya bila kamu yakin setelah memeriksa.
4. Keluarkan HANYA JSON dengan skema yang sama persis seperti masukan, ditambah field `"changes": [{"index": number, "field": string, "reason": string}]` yang mencatat setiap koreksi.

Teks sumber:
{{segment_source}}

Analisis yang diperiksa:
{{analysis_json}}
```
