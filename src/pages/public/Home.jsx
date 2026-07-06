import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import GaleriMarquee from '../../components/GaleriMarquee'
import StatCounter from '../../components/StatCounter'

const sectionInfo = {
  profil: { to: '/profil/sejarah', label: 'Tentang Kami', desc: 'Sejarah, sambutan, visi & misi sekolah' },
  berita: { to: '/berita', label: 'Berita & Kegiatan', desc: 'Kabar terbaru seputar sekolah' },
  galeri: { to: '/galeri', label: 'Galeri Foto', desc: 'Dokumentasi kegiatan sekolah' },
  aplikasi: { to: '/aplikasi', label: 'Aplikasi Sekolah', desc: 'E-Asesmen, SI Diswa, dan lainnya' },
  kontak: { to: '/kontak', label: 'Kontak', desc: 'Alamat, telepon, dan lokasi sekolah' },
}
const defaultSections = ['profil', 'berita', 'galeri', 'aplikasi', 'kontak'].map((key) => ({ key, aktif: true }))
const defaultBlocks = ['statistik', 'sambutan', 'jelajahi', 'prestasi', 'pengumuman', 'marquee'].map((key) => ({ key, aktif: true }))

export default function Home() {
  const [pengumuman, setPengumuman] = useState([])
  const [pengaturan, setPengaturan] = useState(null)
  const [prestasi, setPrestasi] = useState([])
  const [counts, setCounts] = useState({ guru: 0, mitra: 0, prestasi: 0, fasilitas: 0 })

  useEffect(() => {
    supabase
      .from('pengumuman')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setPengumuman(data || []))

    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => setPengaturan(data))

    supabase.from('galeri').select('*').eq('aktif', true).eq('kategori', 'prestasi')
      .order('created_at', { ascending: false }).limit(4)
      .then(({ data }) => setPrestasi(data || []))

    Promise.all([
      supabase.from('tenaga_pendidik').select('id', { count: 'exact', head: true }).eq('aktif', true),
      supabase.from('kemitraan').select('id', { count: 'exact', head: true }).eq('aktif', true),
      supabase.from('galeri').select('id', { count: 'exact', head: true }).eq('aktif', true).eq('kategori', 'prestasi'),
      supabase.from('fasilitas').select('id', { count: 'exact', head: true }).eq('aktif', true),
    ]).then(([guru, mitra, prestasiCount, fasilitas]) => {
      setCounts({
        guru: guru.count || 0,
        mitra: mitra.count || 0,
        prestasi: prestasiCount.count || 0,
        fasilitas: fasilitas.count || 0,
      })
    })
  }, [])

  const sections = pengaturan?.beranda_sections?.length ? pengaturan.beranda_sections : defaultSections
  const quickLinks = sections.filter((s) => s.aktif && sectionInfo[s.key]).map((s) => ({ ...sectionInfo[s.key], key: s.key }))
  const hasStats = counts.guru + counts.mitra + counts.prestasi + counts.fasilitas > 0
  const blocks = pengaturan?.beranda_blocks?.length ? pengaturan.beranda_blocks : defaultBlocks

  const blockNodes = {
    statistik: hasStats && (
      <section key="statistik" className="bg-chalkboard text-paper">
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCounter value={counts.guru} label="Tenaga Pendidik" />
          <StatCounter value={counts.fasilitas} label="Fasilitas" />
          <StatCounter value={counts.prestasi} label="Prestasi" />
          <StatCounter value={counts.mitra} label="Mitra Sekolah" />
        </div>
      </section>
    ),
    sambutan: pengaturan?.sambutan_kepala_sekolah && (
      <section key="sambutan" className="max-w-6xl mx-auto px-5 py-14">
        <div className="glass shadow-sm rounded-lg p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center">
          {pengaturan.foto_kepala_sekolah_url && (
            <img
              src={pengaturan.foto_kepala_sekolah_url}
              alt={pengaturan.nama_kepala_sekolah}
              className="w-28 h-28 rounded-full object-cover shrink-0"
            />
          )}
          <div>
            <h2 className="font-display text-xl font-bold mb-2">Sambutan Kepala Sekolah</h2>
            <p className="text-ink/80 italic line-clamp-3">"{pengaturan.sambutan_kepala_sekolah}"</p>
            {pengaturan.nama_kepala_sekolah && (
              <p className="font-display font-bold mt-3">{pengaturan.nama_kepala_sekolah}</p>
            )}
            <Link to="/profil/sambutan" className="inline-block mt-2 text-rust font-medium hover:underline">
              Baca sambutan lengkap →
            </Link>
          </div>
        </div>
      </section>
    ),
    jelajahi: quickLinks.length > 0 && (
      <section key="jelajahi" className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="font-display text-2xl font-bold mb-6">Jelajahi Website</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="glass shadow-sm rounded-lg p-5 hover:border-amber hover:shadow-md transition-all"
            >
              <h3 className="font-display font-bold text-lg mb-1">{q.label}</h3>
              <p className="text-sm text-ink/70">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    ),
    prestasi: prestasi.length > 0 && (
      <section key="prestasi" className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Prestasi Sekolah</h2>
          <Link to="/galeri/prestasi" className="text-sm text-rust font-medium hover:underline shrink-0">
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {prestasi.map((p) => (
            <Link
              key={p.id}
              to="/galeri/prestasi"
              className="relative block aspect-square overflow-hidden rounded-lg border border-ink/10 group"
            >
              <img
                src={p.foto_url}
                alt={p.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 left-2 bg-amber text-chalkboard rounded-full w-7 h-7 flex items-center justify-center text-sm">
                🏆
              </span>
            </Link>
          ))}
        </div>
      </section>
    ),
    pengumuman: (
      <section key="pengumuman" className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="font-display text-2xl font-bold mb-6">Pengumuman Terbaru</h2>
        {pengumuman.length === 0 ? (
          <p className="text-ink/70">Belum ada pengumuman yang dipublikasikan.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {pengumuman.map((p) => (
              <article key={p.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
                {p.foto_url && (
                  <img src={p.foto_url} alt={p.judul} className="w-full h-36 object-cover" />
                )}
                <div className="p-5">
                  <p className="text-xs text-rust font-medium mb-2">
                    {new Date(p.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <h3 className="font-display font-bold text-lg mb-2">{p.judul}</h3>
                  <p className="text-sm text-ink/70 line-clamp-3">{p.isi}</p>
                  {(p.file_url || p.link_url) && (
                    <div className="flex gap-3 mt-3 text-xs">
                      {p.file_url && <a href={p.file_url} target="_blank" rel="noreferrer" className="text-rust font-medium hover:underline">📎 Unduh File</a>}
                      {p.link_url && <a href={p.link_url} target="_blank" rel="noreferrer" className="text-rust font-medium hover:underline">🔗 Selengkapnya</a>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <Link to="/pengumuman" className="inline-block mt-6 text-rust font-medium hover:underline">
          Lihat semua pengumuman →
        </Link>
      </section>
    ),
    marquee: <GaleriMarquee key="marquee" />,
  }

  return (
    <div>
      <section
        className="relative bg-chalkboard text-paper bg-cover bg-center"
        style={pengaturan?.hero_image_url ? { backgroundImage: `url("${pengaturan.hero_image_url}")` } : undefined}
      >
        {pengaturan?.hero_image_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-chalkboard via-chalkboard/90 to-chalkboard/60" />
        )}
        <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
          <p className="text-amber font-medium mb-3 tracking-wide">Selamat Datang di</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold max-w-xl leading-tight">
            SMP Negeri 3 Besuki
          </h1>
          <p className="mt-4 max-w-lg text-paper/80">
            {pengaturan?.tagline ||
              'Informasi sekolah, pengumuman, kegiatan, galeri, dan akses ke seluruh aplikasi sekolah dalam satu tempat.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/profil/sejarah"
              className="bg-amber text-chalkboard px-5 py-2.5 rounded font-medium hover:opacity-90"
            >
              Tentang Kami
            </Link>
            <Link
              to="/aplikasi"
              className="border border-paper/40 px-5 py-2.5 rounded hover:border-amber hover:text-amber"
            >
              Aplikasi Sekolah
            </Link>
          </div>
        </div>
        <div className="relative chalk-divider" />
      </section>

      {blocks.filter((b) => b.aktif).map((b) => blockNodes[b.key] || null)}
    </div>
  )
}
