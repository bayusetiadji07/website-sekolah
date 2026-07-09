-- ============================================
-- TABEL GALERI VIDEO (YouTube)
-- Jalankan di Supabase SQL Editor
-- ============================================

-- Tabel galeri video
create table if not exists galeri_video (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  video_url text not null,
  deskripsi text,
  thumbnail_url text,
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table galeri_video enable row level security;

-- Policy untuk galeri_video
create policy "publik baca galeri_video aktif" on galeri_video
  for select using (aktif = true);

create policy "admin full akses galeri_video" on galeri_video
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
