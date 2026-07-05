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
