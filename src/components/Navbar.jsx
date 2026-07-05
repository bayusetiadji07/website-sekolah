import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('logo_url').eq('id', 1).single()
      .then(({ data }) => setLogoUrl(data?.logo_url || ''))
  }, [])

  return (
    <header className="glass-dark text-paper sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-amber shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo SMPN 3 Besuki" className="h-9 w-9 object-contain rounded bg-white/10 p-1" />
          ) : null}
          <span>SMPN 3 Besuki</span>
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
        </nav>
      )}
    </header>
  )
}
