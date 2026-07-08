import { Link } from 'react-router-dom'
import { Image, Camera, Trophy, ArrowRight } from 'lucide-react'

const categories = [
  {
    to: '/galeri/kegiatan',
    label: 'Galeri Kegiatan',
    desc: 'Dokumentasi kegiatan dan aktivitas sekolah sehari-hari',
    icon: Camera,
    color: 'from-secondary to-secondary-dark',
    count: null,
  },
  {
    to: '/galeri/prestasi',
    label: 'Galeri Prestasi',
    desc: 'Penghargaan dan pencapaian luar biasa sekolah',
    icon: Trophy,
    color: 'from-accent to-accent-light',
    count: null,
  },
]

export default function GaleriOverview() {
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
          <h1>Galeri Foto</h1>
          <p>Dokumentasi kegiatan dan prestasi SMP Negeri 3 Besuki</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="card group p-6 hover:border-secondary/30"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-sm text-ink-light leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-ink/5 flex items-center justify-between">
                <span className="text-sm text-ink-light">Lihat koleksi foto</span>
                <span className="read-more text-secondary">
                  Buka
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-12 glass-card rounded-2xl p-6 text-center">
          <Image className="w-10 h-10 text-secondary mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-2">Album Foto Digital</h3>
          <p className="text-sm text-ink-light max-w-md mx-auto">
            Semua kegiatan dan prestasi sekolah didokumentasikan dalam album foto digital yang dapat diakses kapan saja.
          </p>
        </div>
      </div>
    </div>
  )
}
