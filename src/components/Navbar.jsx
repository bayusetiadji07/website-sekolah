import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/berita', label: 'Berita' },
  { to: '/pengumuman', label: 'Pengumuman' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/materi', label: 'Materi' },
  { to: '/aplikasi', label: 'Aplikasi Sekolah' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-chalkboard text-paper sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold text-amber shrink-0">
          SMPN 3 Besuki
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`hover:text-amber transition-colors ${
                location.pathname === l.to ? 'text-amber' : 'text-paper/85'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/masuk"
            className="border border-amber text-amber px-3 py-1.5 rounded hover:bg-amber hover:text-chalkboard transition-colors"
          >
            Masuk
          </Link>
        </nav>

        <button
          className="lg:hidden text-paper"
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden flex flex-col gap-1 px-5 pb-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-2 text-paper/90 hover:text-amber"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/masuk"
            onClick={() => setOpen(false)}
            className="py-2 text-amber font-medium"
          >
            Masuk
          </Link>
        </nav>
      )}
    </header>
  )
}
