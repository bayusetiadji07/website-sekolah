import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Image, Camera, Trophy, ArrowRight, Play, Loader2 } from 'lucide-react'

const categories = [
  {
    to: '/galeri/kegiatan',
    label: 'Galeri Kegiatan',
    desc: 'Dokumentasi kegiatan dan aktivitas sekolah sehari-hari',
    icon: Camera,
    color: 'from-secondary to-secondary-dark',
  },
  {
    to: '/galeri/prestasi',
    label: 'Galeri Prestasi',
    desc: 'Penghargaan dan pencapaian luar biasa sekolah',
    icon: Trophy,
    color: 'from-accent to-accent-light',
  },
]

export default function GaleriOverview() {
  const [videoCount, setVideoCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('galeri_video')
      .select('id', { count: 'exact', head: true })
      .eq('aktif', true)
      .then(({ count }) => {
        setVideoCount(count || 0)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Galeri</span>
          </div>
          <h1>Galeri SMP Negeri 3 Besuki</h1>
          <p>Dokumentasi foto dan video kegiatan serta prestasi sekolah</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        {/* Video Section - Featured */}
        <div className="mb-8">
          <Link
            to="/galeri/video"
            className="block bg-gradient-to-r from-red-600 to-red-700 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
                  Galeri Video
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {loading ? 'Memuat...' : `${videoCount} video kegiatan`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span className="text-sm hidden sm:inline">Lihat semua</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Photo Categories */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-ink mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-secondary" />
          Galeri Foto
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="card group p-4 sm:p-6 hover:border-secondary/30"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-ink/5 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-ink-light">Lihat koleksi foto</span>
                <span className="read-more text-secondary text-xs sm:text-sm">
                  Buka
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info section */}
        <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
          <Image className="w-8 h-8 sm:w-10 sm:h-10 text-secondary mx-auto mb-2 sm:mb-3" />
          <h3 className="font-display font-bold text-base sm:text-lg mb-1 sm:mb-2">Album Foto & Video Digital</h3>
          <p className="text-xs sm:text-sm text-ink-light max-w-md mx-auto">
            Semua kegiatan dan prestasi sekolah didokumentasikan dalam album foto dan video digital yang dapat diakses kapan saja.
          </p>
        </div>
      </div>
    </div>
  )
}
