import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import NavDropdown from './NavDropdown'
import { tentangKamiTabs } from './TentangKamiTabs'
import { Menu, X, ChevronDown, ChevronRight, BookOpen, Image, Megaphone, Phone, MessageSquare, Play } from 'lucide-react'

const galeriTabs = [
  { to: '/galeri/kegiatan', label: 'Galeri Kegiatan' },
  { to: '/galeri/prestasi', label: 'Galeri Prestasi' },
  { to: '/galeri/video', label: 'Galeri Video', icon: Play },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('logo_url').eq('id', 1).single()
      .then(({ data }) => setLogoUrl(data?.logo_url || ''))
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isTentangKamiActive = location.pathname.startsWith('/profil')
  const isGaleriActive = location.pathname.startsWith('/galeri')

  return (
    <>
      <header className="glass-dark text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white shrink-0 group">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-9 w-9 object-contain rounded-lg bg-white/10 p-1 transition-opacity group-hover:bg-white/20" />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="hidden sm:inline">SMP Negeri 3 Besuki</span>
            <span className="sm:hidden">SMPN 3 Besuki</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" active={location.pathname === '/'}>
              Beranda
            </NavLink>

            {/* Tentang Kami - Mega Menu Style */}
            <NavDropdown label="Tentang Kami" active={isTentangKamiActive} mega>
              <div className="grid grid-cols-2 gap-1 p-3">
                {tentangKamiTabs.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <NavIcon path={t.to} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-ink">{t.label}</p>
                      <p className="text-xs text-ink-light">Profil sekolah</p>
                    </div>
                  </Link>
                ))}
              </div>
            </NavDropdown>

            <NavLink to="/berita" active={location.pathname === '/berita'}>
              Berita
            </NavLink>

            <NavLink to="/pengumuman" active={location.pathname === '/pengumuman'}>
              <Megaphone className="w-4 h-4 inline-block mr-1" />
              Pengumuman
            </NavLink>

            <NavDropdown label="Galeri" active={isGaleriActive}>
              {galeriTabs.map((t) => (
                <Link key={t.to} to={t.to} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors">
                  {t.icon ? <t.icon className="w-4 h-4 text-red-500" /> : <Image className="w-4 h-4 text-secondary" />}
                  {t.label}
                </Link>
              ))}
              <div className="my-1 border-t border-ink/10" />
              <Link to="/galeri" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-secondary hover:bg-secondary/10 transition-colors">
                Lihat Semua Galeri
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            </NavDropdown>

            <NavLink to="/aplikasi" active={location.pathname === '/aplikasi'}>
              Aplikasi
            </NavLink>

            <NavLink to="/kontak" active={location.pathname === '/kontak'}>
              <Phone className="w-4 h-4 inline-block mr-1" />
              Kontak
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/saran"
              className="btn btn-secondary text-sm py-2"
            >
              <MessageSquare className="w-4 h-4" />
              Saran
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Bottom Border */}
        <div className="lg:hidden h-px bg-white/10" />
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="glass-dark text-white px-5 py-4 flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-2.5 font-display font-bold">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain rounded bg-white/10 p-1" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                )}
                <span>SMP Negeri 3 Besuki</span>
              </div>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-1">
              <MobileNavLink to="/" icon={<BookOpen className="w-5 h-5" />}>
                Beranda
              </MobileNavLink>

              {/* Tentang Kami Section */}
              <div className="py-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-light mb-2">
                  Tentang Kami
                </p>
                {tentangKamiTabs.map((t) => (
                  <MobileNavLink key={t.to} to={t.to} indent>
                    {t.label}
                  </MobileNavLink>
                ))}
              </div>

              <MobileNavLink to="/berita" icon={<Megaphone className="w-5 h-5" />}>
                Berita
              </MobileNavLink>

              <MobileNavLink to="/pengumuman" icon={<Megaphone className="w-5 h-5" />}>
                Pengumuman
              </MobileNavLink>

              {/* Galeri Section */}
              <div className="py-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-light mb-2">
                  Galeri
                </p>
                {galeriTabs.map((t) => (
                  <MobileNavLink
                    key={t.to}
                    to={t.to}
                    indent
                    icon={t.icon ? <t.icon className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                  >
                    {t.label}
                  </MobileNavLink>
                ))}
                <MobileNavLink to="/galeri" indent>
                  Lihat Semua Galeri
                </MobileNavLink>
              </div>

              <MobileNavLink to="/aplikasi" icon={<BookOpen className="w-5 h-5" />}>
                Aplikasi Sekolah
              </MobileNavLink>

              <MobileNavLink to="/kontak" icon={<Phone className="w-5 h-5" />}>
                Kontak
              </MobileNavLink>

              <MobileNavLink to="/saran" icon={<MessageSquare className="w-5 h-5" />}>
                Saran
              </MobileNavLink>

              <MobileNavLink to="/materi" icon={<BookOpen className="w-5 h-5" />}>
                Materi Pembelajaran
              </MobileNavLink>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-ink/10 mt-4">
                <Link
                  to="/saran"
                  className="btn btn-secondary w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Kirim Saran
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

// Desktop NavLink
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-secondary bg-secondary/10'
          : 'text-white/85 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  )
}

// Mobile NavLink
function MobileNavLink({ to, icon, indent, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
        indent
          ? 'text-ink hover:bg-primary/5 hover:text-primary pl-8'
          : 'text-ink hover:bg-primary/5 hover:text-primary'
      }`}
    >
      {icon ? <span className={indent ? 'text-secondary pl-4' : 'text-secondary'}>{icon}</span> : null}
      {children}
    </Link>
  )
}

// Get icon based on path
function NavIcon({ path }) {
  const icons = {
    '/profil/sejarah': BookOpen,
    '/profil/sambutan': BookOpen,
    '/profil/visi-misi': BookOpen,
    '/profil/tenaga-pendidik': BookOpen,
    '/profil/fasilitas': BookOpen,
    '/profil/kemitraan': BookOpen,
  }
  const Icon = icons[path] || BookOpen
  return <Icon className="w-4 h-4 text-secondary" />
}
