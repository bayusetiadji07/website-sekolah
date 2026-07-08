-- ============================================
-- SKEMA DATABASE WEBSITE SEKOLAH
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. PROFILES (role: admin / guru)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nama text,
  mapel text,
  role text check (role in ('admin', 'guru')),
  created_at timestamptz default now()
);

-- Otomatis buat baris profile saat user baru daftar/dibuat
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PENGUMUMAN
create table pengumuman (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  isi text not null,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

-- 3. BERITA & KEGIATAN
create table berita_kegiatan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  isi text not null,
  foto_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

-- 4. MATERI PEMBELAJARAN
create table materi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  mapel text,
  kelas text,
  file_url text,
  link_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 5. LINK APLIKASI SEKOLAH (eAsesmen, SI Diswa, dll)
create table app_links (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  url text not null,
  deskripsi text,
  ikon_url text,
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table pengumuman enable row level security;
alter table berita_kegiatan enable row level security;
alter table materi enable row level security;
alter table app_links enable row level security;

-- PROFILES: user bisa baca profil sendiri, admin baca semua
create policy "user baca profil sendiri" on profiles
  for select using (auth.uid() = id);
create policy "admin baca semua profil" on profiles
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "admin ubah profil siapa saja" on profiles
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- PENGUMUMAN: publik baca yang published, admin full akses
create policy "publik baca pengumuman published" on pengumuman
  for select using (status = 'published');
create policy "admin full akses pengumuman" on pengumuman
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- BERITA: sama seperti pengumuman
create policy "publik baca berita published" on berita_kegiatan
  for select using (status = 'published');
create policy "admin full akses berita" on berita_kegiatan
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- MATERI: publik baca yang published, guru kelola materi sendiri, admin full akses
create policy "publik baca materi published" on materi
  for select using (status = 'published');
create policy "guru baca materi sendiri" on materi
  for select using (uploaded_by = auth.uid());
create policy "guru insert materi sendiri" on materi
  for insert with check (uploaded_by = auth.uid());
create policy "guru update materi sendiri" on materi
  for update using (uploaded_by = auth.uid());
create policy "guru delete materi sendiri" on materi
  for delete using (uploaded_by = auth.uid());
create policy "admin full akses materi" on materi
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- APP_LINKS: publik baca yang aktif, admin full akses
create policy "publik baca app_links aktif" on app_links
  for select using (aktif = true);
create policy "admin full akses app_links" on app_links
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 6. PENGATURAN SEKOLAH (singleton: profil + kontak)
create table pengaturan_sekolah (
  id int primary key default 1 check (id = 1),
  nama_sekolah text default 'SMP Negeri 3 Besuki',
  tagline text default '',
  sambutan_kepala_sekolah text default '',
  nama_kepala_sekolah text default '',
  foto_kepala_sekolah_url text default '',
  visi text default '',
  misi text default '',
  sejarah text default '',
  foto_sekolah_url text default '',
  alamat text default '',
  telepon text default '',
  email text default '',
  jam_operasional text default '',
  maps_embed_url text default '',
  instagram_url text default '',
  facebook_url text default '',
  youtube_url text default '',
  tiktok_url text default '',
  updated_at timestamptz default now()
);
insert into pengaturan_sekolah (id) values (1);

-- 6a. TENAGA PENDIDIK & KEPENDIDIKAN
create table tenaga_pendidik (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  kategori text default 'pendidik' check (kategori in ('pendidik', 'kependidikan')),
  foto_url text,
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

alter table tenaga_pendidik enable row level security;
create policy "publik baca tenaga pendidik aktif" on tenaga_pendidik
  for select using (aktif = true);
create policy "admin full akses tenaga pendidik" on tenaga_pendidik
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 6b. KEMITRAAN SEKOLAH
create table kemitraan (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  deskripsi text,
  logo_url text,
  url text,
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

alter table kemitraan enable row level security;
create policy "publik baca kemitraan aktif" on kemitraan
  for select using (aktif = true);
create policy "admin full akses kemitraan" on kemitraan
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 6c. FASILITAS SEKOLAH
create table fasilitas (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  deskripsi text,
  foto_url text,
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

alter table fasilitas enable row level security;
create policy "publik baca fasilitas aktif" on fasilitas
  for select using (aktif = true);
create policy "admin full akses fasilitas" on fasilitas
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 7. GALERI FOTO
create table galeri (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  foto_url text not null,
  keterangan text,
  kategori text default 'kegiatan' check (kategori in ('kegiatan', 'prestasi', 'kemitraan')),
  aktif boolean default true,
  urutan int default 0,
  created_at timestamptz default now()
);

-- 8. AGENDA KEGIATAN
create table agenda (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text,
  tanggal_mulai date not null,
  tanggal_selesai date,
  lokasi text,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

alter table pengaturan_sekolah enable row level security;
create policy "publik baca pengaturan" on pengaturan_sekolah
  for select using (true);
create policy "admin ubah pengaturan" on pengaturan_sekolah
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

alter table galeri enable row level security;
create policy "publik baca galeri aktif" on galeri
  for select using (aktif = true);
create policy "admin full akses galeri" on galeri
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

alter table agenda enable row level security;
create policy "publik baca agenda published" on agenda
  for select using (status = 'published');
create policy "admin full akses agenda" on agenda
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- STORAGE BUCKET untuk file materi & foto berita
-- ============================================
insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "publik baca file media" on storage.objects
  for select using (bucket_id = 'media');
create policy "user login boleh upload media" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "user login boleh hapus media miliknya" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
