import { Link, useLocation } from 'react-router-dom'

export const tentangKamiTabs = [
  { to: '/profil/sejarah', label: 'Sejarah Sekolah' },
  { to: '/profil/sambutan', label: 'Sambutan Kepala Sekolah' },
  { to: '/profil/visi-misi', label: 'Visi & Misi' },
  { to: '/profil/tenaga-pendidik', label: 'Tenaga Pendidik & Kependidikan' },
  { to: '/profil/fasilitas', label: 'Fasilitas' },
  { to: '/profil/kemitraan', label: 'Kemitraan Sekolah' },
]

export default function TentangKamiTabs() {
  const location = useLocation()
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {tentangKamiTabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            location.pathname === t.to
              ? 'bg-chalkboard text-paper border-chalkboard'
              : 'border-ink/15 text-ink/70 hover:border-amber hover:text-rust'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
