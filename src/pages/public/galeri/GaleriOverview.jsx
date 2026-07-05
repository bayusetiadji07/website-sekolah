import { Link } from 'react-router-dom'

const categories = [
  { to: '/galeri/kegiatan', label: 'Galeri Kegiatan', desc: 'Dokumentasi kegiatan dan aktivitas sekolah' },
  { to: '/galeri/prestasi', label: 'Galeri Prestasi', desc: 'Dokumentasi penghargaan dan prestasi sekolah' },
]

export default function GaleriOverview() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Galeri Foto</h1>
      <div className="chalk-divider w-24 mb-8" />

      <div className="grid sm:grid-cols-2 gap-5">
        {categories.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="glass shadow-sm rounded-lg p-6 hover:border-amber hover:shadow-md transition-all"
          >
            <h3 className="font-display font-bold text-lg mb-1">{c.label}</h3>
            <p className="text-sm text-ink/60">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
