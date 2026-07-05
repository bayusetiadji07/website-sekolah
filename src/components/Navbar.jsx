import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import NavDropdown from './NavDropdown'
import { tentangKamiTabs } from './TentangKamiTabs'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/berita', label: 'Berita' },
  { to: '/pengumuman', label: 'Pengumuman' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/materi', label: 'Materi' },
  { to: '/kontak', label: 'Kontak' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [apps, setApps] = useState([])

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('logo_url').eq('id', 1).single()
      .then(({ data }) => setLogoUrl(data?.logo_url || ''))

    supabase.from('app_links').select('*').eq('aktif', true).order('urutan')
      .then(({ data }) => setApps(data || []))
  }, [])

  const isTentangKamiActive = location.pathname.startsWith('/profil')

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
          <Link
            to="/"
            className={`hover:text-amber transition-colors ${location.pathname === '/' ? 'text-amber' : 'text-paper/85'}`}
          >
            Beranda
          </Link>

          <NavDropdown label="Tentang Kami" active={isTentangKamiActive}>
            <Link to="/profil" className="block px-4 py-2 text-sm hover:bg-amber/10 hover:text-rust font-medium">
              Ringkasan
            </Link>
            <div className="my-1 border-t border-ink/10" />
            {tentangKamiTabs.map((t) => (
              <Link key={t.to} to={t.to} className="block px-4 py-2 text-sm hover:bg-amber/10 hover:text-rust">
                {t.label}
              </Link>
            ))}
          </NavDropdown>

          {links.slice(1).map((l) => (
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

          <NavDropdown label="Aplikasi Sekolah" active={location.pathname === '/aplikasi'}>
            {apps.length === 0 ? (
              <p className="px-4 py-2 text-sm text-ink/50">Belum ada aplikasi ditautkan.</p>
            ) : (
              apps.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-amber/10 hover:text-rust"
                >
                  {a.ikon_url ? (
                    <img src={a.ikon_url} alt={a.nama} className="w-6 h-6 object-contain rounded shrink-0" />
                  ) : (
                    <span className="w-6 h-6 rounded bg-chalkboard/10 flex items-center justify-center text-xs font-bold text-chalkboard shrink-0">
                      {a.nama?.[0]}
                    </span>
                  )}
                  {a.nama}
                </a>
              ))
            )}
            <div className="my-1 border-t border-ink/10" />
            <Link to="/aplikasi" className="block px-4 py-2 text-sm font-medium hover:bg-amber/10 hover:text-rust">
              Lihat Semua Aplikasi →
            </Link>
          </NavDropdown>
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
          <div className="border-t border-paper/10 my-1 pt-2">
            <p className="text-paper/50 text-xs uppercase mb-1">Tentang Kami</p>
            <Link to="/profil" onClick={() => setOpen(false)} className="block py-1.5 text-paper/90 hover:text-amber">
              Ringkasan
            </Link>
            {tentangKamiTabs.map((t) => (
              <Link key={t.to} to={t.to} onClick={() => setOpen(false)} className="block py-1.5 text-paper/90 hover:text-amber">
                {t.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-paper/10 my-1 pt-2">
            <p className="text-paper/50 text-xs uppercase mb-1">Aplikasi Sekolah</p>
            {apps.map((a) => (
              <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="block py-1.5 text-paper/90 hover:text-amber">
                {a.nama}
              </a>
            ))}
            <Link to="/aplikasi" onClick={() => setOpen(false)} className="block py-1.5 text-amber font-medium">
              Lihat Semua Aplikasi →
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
