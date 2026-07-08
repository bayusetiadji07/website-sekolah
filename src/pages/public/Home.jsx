import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import GaleriMarquee from '../../components/GaleriMarquee'
import StatCounter from '../../components/StatCounter'
import HeroCarousel from '../../components/HeroCarousel'
import ArticleCard from '../../components/ArticleCard'
import { ChevronRight, ArrowRight } from 'lucide-react'

const sectionInfo = {
  profil: { to: '/profil/sejarah', label: 'Tentang Kami', desc: 'Sejarah, sambut, visi & misi sekolah', icon: 'BookOpen' },
  berita: { to: '/berita', label: 'Berita & Kegiatan', desc: 'Kabar terbaru seputar sekolah', icon: 'Newspaper' },
  galeri: { to: '/galeri', label: 'Galeri Foto', desc: 'Dokumentasi kegiatan sekolah', icon: 'Image' },
  aplikasi: { to: '/aplikasi', label: 'Aplikasi Sekolah', desc: 'E-Asesmen, SI Diswa, dan lainnya', icon: 'App' },
  kontak: { to: '/kontak', label: 'Kontak', desc: 'Alamat, telepon, dan lokasi sekolah', icon: 'MapPin' },
}

const defaultSections = ['profil', 'berita', 'galeri', 'aplikasi', 'kontak'].map((key) => ({ key, aktif: true }))
const defaultBlocks = ['statistik', 'sambutan', 'jelajahi', 'prestasi', 'berita', 'pengumuman', 'marquee'].map((key) => ({ key, aktif: true }))

// Gabungkan blok tersimpan di database dengan blok default terbaru,
// supaya blok baru (mis. "berita") tetap muncul walau pengaturan lama sudah pernah disimpan.
function mergeBlocks(saved, defaults) {
  const savedKeys = new Set(saved.map((b) => b.key))
  const missing = defaults.filter((b) => !savedKeys.has(b.key))
  return [...saved, ...missing]
}

export default function Home() {
  const [pengumuman, setPengumuman] = useState([])
  const [berita, setBerita] = useState([])
  const [pengaturan, setPengaturan] = useState(null)
  const [prestasi, setPrestasi] = useState([])
  const [counts, setCounts] = useState({ guru: 0, kependidikan: 0, mitra: 0, prestasi: 0, fasilitas: 0 })

  useEffect(() => {
    supabase
      .from('pengumuman')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setPengumuman(data || []))

    supabase
      .from('berita_kegiatan')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setBerita(data || []))

    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => setPengaturan(data))

    supabase.from('galeri').select('*').eq('aktif', true).eq('kategori', 'prestasi')
      .order('created_at', { ascending: false }).limit(4)
      .then(({ data }) => setPrestasi(data || []))

    Promise.all([
      supabase.from('tenaga_pendidik').select('id', { count: 'exact', head: true }).eq('aktif', true).eq('kategori', 'pendidik'),
      supabase.from('tenaga_pendidik').select('id', { count: 'exact', head: true }).eq('aktif', true).eq('kategori', 'kependidikan'),
      supabase.from('kemitraan').select('id', { count: 'exact', head: true }).eq('aktif', true),
      supabase.from('galeri').select('id', { count: 'exact', head: true }).eq('aktif', true).eq('kategori', 'prestasi'),
      supabase.from('fasilitas').select('id', { count: 'exact', head: true }).eq('aktif', true),
    ]).then(([guru, kependidikan, mitra, prestasiCount, fasilitas]) => {
      setCounts({
        guru: guru.count || 0,
        kependidikan: kependidikan.count || 0,
        mitra: mitra.count || 0,
        prestasi: prestasiCount.count || 0,
        fasilitas: fasilitas.count || 0,
      })
    })
  }, [])

  const sections = pengaturan?.beranda_sections?.length ? pengaturan.beranda_sections : defaultSections
  const quickLinks = sections.filter((s) => s.aktif && sectionInfo[s.key]).map((s) => ({ ...sectionInfo[s.key], key: s.key }))
  const hasStats = counts.guru + counts.kependidikan + counts.mitra + counts.prestasi + counts.fasilitas > 0
  const blocks = pengaturan?.beranda_blocks?.length ? mergeBlocks(pengaturan.beranda_blocks, defaultBlocks) : defaultBlocks

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const blockNodes = {
    statistik: hasStats && (
      <section key="statistik" className="bg-dark text-white">
        <div className="max-w-6xl mx-auto px-5 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCounter value={counts.guru} label="Guru" />
          <StatCounter value={counts.kependidikan} label="Tenaga Kependidikan" />
          <StatCounter value={counts.fasilitas} label="Fasilitas" />
          <StatCounter value={counts.prestasi} label="Prestasi" />
          <StatCounter value={counts.mitra} label="Mitra Sekolah" />
        </div>
      </section>
    ),
    sambutan: pengaturan?.sambutan_kepala_sekolah && (
      <section key="sambutan" className="bg-paper">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center">
            {pengaturan.foto_kepala_sekolah_url && (
              <img
                src={pengaturan.foto_kepala_sekolah_url}
                alt={pengaturan.nama_kepala_sekolah}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg shrink-0"
              />
            )}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 badge badge-secondary mb-3">
                Sambutan Kepala Sekolah
              </div>
              <p className="text-ink/80 italic leading-relaxed mb-4 line-clamp-4 text-base">
                "{pengaturan.sambutan_kepala_sekolah}"
              </p>
              {pengaturan.nama_kepala_sekolah && (
                <p className="font-display font-bold text-lg">{pengaturan.nama_kepala_sekolah}</p>
              )}
              <Link to="/profil/sambutan" className="read-more mt-2 inline-flex">
                Baca sambut lengkap
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    jelajahi: quickLinks.length > 0 && (
      <section key="jelajahi" className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title !mb-0">
            Jelajahi <span>Website</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="card p-5 text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <ChevronRight className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-base mb-1">{q.label}</h3>
              <p className="text-xs text-ink-light">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    ),
    prestasi: prestasi.length > 0 && (
      <section key="prestasi" className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-lg">🏆</span>
              </div>
              <h2 className="section-title !mb-0">Prestasi <span>Sekolah</span></h2>
            </div>
            <Link to="/galeri/prestasi" className="read-more">
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prestasi.map((p) => (
              <Link
                key={p.id}
                to="/galeri/prestasi"
                className="relative block aspect-square overflow-hidden rounded-xl border border-ink/5 shadow-sm group"
              >
                <img
                  src={p.foto_url}
                  alt={p.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-sm font-medium">{p.judul}</span>
                </div>
                <div className="absolute top-2 left-2 bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow">
                  🏆
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    ),
    berita: berita.length > 0 && (
      <section key="berita" className="bg-paper py-14">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📰</span>
              </div>
              <h2 className="section-title !mb-0">Berita <span>& Kegiatan</span></h2>
            </div>
            <Link to="/berita" className="read-more">
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {berita.map((b) => (
              <ArticleCard
                key={b.id}
                image={b.foto_url}
                category="Berita"
                date={formatDate(b.created_at)}
                title={b.judul}
                excerpt={b.isi}
                to={`/berita/${b.id}`}
                badgeColor="primary"
              />
            ))}
          </div>
        </div>
      </section>
    ),
    pengumuman: (
      <section key="pengumuman" className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span className="text-lg">📢</span>
            </div>
            <h2 className="section-title !mb-0">Pengumuman <span>Terbaru</span></h2>
          </div>
          <Link to="/pengumuman" className="read-more">
            Lihat semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {pengumuman.length === 0 ? (
          <div className="empty-state">
            <h3>Belum Ada Pengumuman</h3>
            <p>Pengumuman terbaru akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {pengumuman.map((p) => (
              <ArticleCard
                key={p.id}
                image={p.foto_url}
                category="Pengumuman"
                date={formatDate(p.created_at)}
                title={p.judul}
                excerpt={p.isi}
                fileUrl={p.file_url}
                linkUrl={p.link_url}
                badgeColor="secondary"
              />
            ))}
          </div>
        )}
      </section>
    ),
    marquee: <GaleriMarquee key="marquee" />,
  }

  return (
    <div>
      <HeroCarousel images={pengaturan?.hero_images?.length ? pengaturan.hero_images : (pengaturan?.hero_image_url ? [pengaturan.hero_image_url] : [])} />

      {blocks.filter((b) => b.aktif).map((b) => blockNodes[b.key] || null)}
    </div>
  )
} 
