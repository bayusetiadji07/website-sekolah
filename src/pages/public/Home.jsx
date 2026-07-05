import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import GaleriMarquee from '../../components/GaleriMarquee'

const sectionInfo = {
  profil: { to: '/profil/sejarah', label: 'Tentang Kami', desc: 'Sejarah, sambutan, visi & misi sekolah' },
  berita: { to: '/berita', label: 'Berita & Kegiatan', desc: 'Kabar terbaru seputar sekolah' },
  galeri: { to: '/galeri', label: 'Galeri Foto', desc: 'Dokumentasi kegiatan sekolah' },
  aplikasi: { to: '/aplikasi', label: 'Aplikasi Sekolah', desc: 'E-Asesmen, SI Diswa, dan lainnya' },
  kontak: { to: '/kontak', label: 'Kontak', desc: 'Alamat, telepon, dan lokasi sekolah' },
}
const defaultSections = ['profil', 'berita', 'galeri', 'aplikasi', 'kontak'].map((key) => ({ key, aktif: true }))

export default function Home() {
  const [pengumuman, setPengumuman] = useState([])
  const [pengaturan, setPengaturan] = useState(null)

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
  }, [])

  const sections = pengaturan?.beranda_sections?.length ? pengaturan.beranda_sections : defaultSections
  const quickLinks = sections.filter((s) => s.aktif && sectionInfo[s.key]).map((s) => ({ ...sectionInfo[s.key], key: s.key }))

  return (
    <div>
      <section className="bg-chalkboard text-paper">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
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
        <div className="chalk-divider" />
      </section>

      {quickLinks.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-14">
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
      )}

      <section className="max-w-6xl mx-auto px-5 py-14">
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
                </div>
              </article>
            ))}
          </div>
        )}
        <Link to="/pengumuman" className="inline-block mt-6 text-rust font-medium hover:underline">
          Lihat semua pengumuman →
        </Link>
      </section>

      <GaleriMarquee />
    </div>
  )
}
