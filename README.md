# Website SMP Negeri 3 Besuki

Website sekolah dengan halaman publik (profil, berita, pengumuman, agenda kegiatan, galeri foto, materi, akses aplikasi sekolah, kontak) dan panel admin + guru untuk mengelola konten.

**Live**: https://website-sekolah-roan.vercel.app (Vercel, auto-deploy dari push ke `main`)

## Yang sudah dibuatkan otomatis
- Project Supabase baru: `website-sekolah` (region ap-southeast-1, tier gratis)
- Skema database + Row Level Security sudah diterapkan (lihat `supabase-schema.sql`)
- Storage bucket `media` untuk file materi & foto berita

## Kredensial Supabase (isi ke .env lokal atau Environment Variables di Vercel)
```
VITE_SUPABASE_URL=https://riajhxegskgwytmpcvut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYWpoeGVnc2tnd3l0bXBjdnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzY1NDgsImV4cCI6MjA5ODgxMjU0OH0.By0kyHCMaqZSgEPoyK9_wDXvtVfBeh1DYq-GIpRWKrY
```
Kunci ini adalah kunci publik (anon key), aman ditaruh di frontend — bukan kunci rahasia.

## Menjalankan di lokal
```
npm install
npm run dev
```

## Deploy ke Vercel
Sudah di-deploy dan di-link ke Vercel project `bayusetiadji07s-projects/website-sekolah`, terhubung ke GitHub repo ini — **auto-deploy tiap push ke `main`**. Env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) sudah diset di Vercel Production.

Untuk deploy manual dari lokal: `npx vercel --prod` (folder ini, sudah login sebagai bayusetiadji07).

## Membuat akun admin pertama
1. Di Supabase Dashboard -> Authentication -> Users -> Add user, isi email & password.
2. Buka Table Editor -> tabel `profiles` -> cari baris dengan email tadi -> isi kolom `role` = `admin`.
3. Login di `/masuk` pada website menggunakan email & password itu.

## Menambahkan guru
1. Admin buat akun guru lewat Supabase Dashboard (Authentication -> Add user).
2. Admin masuk ke `/admin/pengguna`, set role guru tersebut menjadi `guru`, isi mapel di tabel `profiles` bila perlu.

## Struktur halaman
- `/` `/profil` `/berita` `/pengumuman` `/agenda` `/galeri` `/materi` `/aplikasi` `/kontak` -- publik
- `/masuk` -- login admin & guru
- `/admin/*` -- panel admin (profil & kontak, pengumuman, berita, agenda, galeri, semua materi, aplikasi sekolah, kelola guru)
- `/guru` -- panel guru (upload materi sendiri, file atau link)

## Mengisi konten profil & kontak
Setelah punya akun admin, buka `/admin/profil` untuk mengisi sambutan kepala sekolah, visi/misi, sejarah, foto sekolah, alamat, telepon, email, jam operasional, link Google Maps embed, dan media sosial. Halaman publik `/profil` dan `/kontak` akan menampilkan data ini otomatis begitu diisi.

## Aplikasi sekolah yang sudah ditautkan
Dikelola di `/admin/aplikasi`:
- **E-Asesmen** (https://e-asesmen.vercel.app) — aktif
- **SI Diswa** (https://si-diswa.vercel.app) — aktif
- **Administrasi Guru** — dinonaktifkan sementara (belum ada URL publik karena produknya berbasis template Google Sheets "buat salinan"). Isi URL yang sesuai lalu aktifkan lewat `/admin/aplikasi` kalau ingin ditampilkan.

## Catatan keamanan
Ada 1 warning minor dari Supabase advisor (kebijakan baca file publik memungkinkan listing isi bucket media). Tidak kritikal untuk kasus ini karena bucket memang publik, tapi kalau nanti ingin dikunci lebih rapat, bisa diubah jadi policy per-folder.

**Perbaikan penting**: sempat ada bug rekursi RLS pada tabel `profiles` (kebijakan "admin baca semua profil" mengecek `profiles` dari dalam kebijakan `profiles` sendiri) yang menyebabkan SEMUA query publik (pengumuman, berita, materi, aplikasi) gagal dengan error 500. Sudah diperbaiki dengan helper function `is_admin()` (SECURITY DEFINER) yang dipakai di semua kebijakan admin, menghindari rekursi.
