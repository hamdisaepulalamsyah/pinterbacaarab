# AGENTS.md

- Baca PROJECT_BRIEF.md sebelum mengubah kode apa pun.
- Kerjakan per fase sesuai Implementation Plan. Tiap fase: lint, typecheck, test hijau → commit → ringkas 3 kalimat → lanjut.
- Jangan hardcode kunci API, URL, atau nama model; semua dari .env. Perbarui .env.example bila menambah variabel.
- Jangan ubah kontrak data (TRD §5) atau skema DB tanpa memperbarui PROJECT_BRIEF.md dan migrasi.
- Teks Arab milik pengguna tidak boleh diubah hurufnya oleh pipeline; hanya harakat yang boleh ditambahkan.
- Jangan menyimpan teks pengguna ke log produksi.
- Berhenti dan tanya manusia hanya bila butuh kredensial, akses server, atau keputusan desain besar.
- Setiap fitur baru wajib punya tes; bug wajib punya tes regresi.

## Backup VPS & Akses Linode

- Host: `139.162.47.209` (User: `root`, Port: `22`)
- SSH Key: `$HOME\.ssh\id_ed25519`
- Direktori Target VPS: `/root/projects/pinterbacaarab`
- Aturan SSH di Windows: Selalu sertakan flag `-n` dan `BatchMode=yes`.
