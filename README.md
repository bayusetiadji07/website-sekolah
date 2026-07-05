# Website Sekolah

Website sekolah dengan halaman publik (profil, pengumuman, berita, materi, akses aplikasi sekolah) dan panel admin + guru untuk mengelola konten.

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

## Cara deploy ke Vercel (subdomain gratis *.vercel.app)
Saya tidak bisa deploy otomatis dari sisi saya untuk project ini — sandbox saya tidak punya akses jaringan ke vercel.com. Langkah manual (5 menit):

1. Push folder ini ke repo GitHub baru.
2. Buka vercel.com -> Add New Project -> import repo tadi.
3. Framework preset otomatis terdeteksi: Vite.
4. Sebelum klik Deploy, buka Environment Variables, tambahkan dua variabel di atas (VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY).
5. Klik Deploy. Selesai, dapat URL nama-project.vercel.app.

Alternatif tanpa GitHub: install Vercel CLI (npm i -g vercel), jalankan `vercel` di folder ini, ikuti prompt login, lalu `vercel --prod`.

## Membuat akun admin pertama
1. Di Supabase Dashboard -> Authentication -> Users -> Add user, isi email & password.
2. Buka Table Editor -> tabel `profiles` -> cari baris dengan email tadi -> isi kolom `role` = `admin`.
3. Login di `/masuk` pada website menggunakan email & password itu.

## Menambahkan guru
1. Admin buat akun guru lewat Supabase Dashboard (Authentication -> Add user).
2. Admin masuk ke `/admin/pengguna`, set role guru tersebut menjadi `guru`, isi mapel di tabel `profiles` bila perlu.

## Struktur halaman
- `/` `/pengumuman` `/berita` `/materi` `/aplikasi` -- publik
- `/masuk` -- login admin & guru
- `/admin/*` -- panel admin (pengumuman, berita, semua materi, aplikasi sekolah, kelola guru)
- `/guru` -- panel guru (upload materi sendiri, file atau link)

## Catatan keamanan
Ada 1 warning minor dari Supabase advisor (kebijakan baca file publik memungkinkan listing isi bucket media). Tidak kritikal untuk kasus ini karena bucket memang publik, tapi kalau nanti ingin dikunci lebih rapat, bisa diubah jadi policy per-folder.
