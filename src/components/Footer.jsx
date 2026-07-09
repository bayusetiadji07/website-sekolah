import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MapPin, Phone, Mail, Clock, BookOpen, Heart, ExternalLink, MessageSquare, Image, Users, FileText } from 'lucide-react'

export default function Footer() {
  const [pengaturan, setPengaturan] = useState(null)
  const [totalKunjungan, setTotalKunjungan] = useState(null)

  useEffect(() => {
    supabase
      .from('pengaturan_sekolah')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setPengaturan(data))

    supabase
      .from('site_stats')
      .select('total_kunjungan')
      .eq('id', 1)
      .single()
      .then(({ data }) => setTotalKunjungan(data?.total_kunjungan ?? null))
  }, [])

  const quickLinks = [
    { to: '/profil/sejarah', label: 'Tentang Kami', icon: BookOpen },
    { to: '/berita', label: 'Berita', icon: FileText },
    { to: '/pengumuman', label: 'Pengumuman', icon: MessageSquare },
    { to: '/galeri', label: 'Galeri', icon: Image },
    { to: '/profil/tenaga-pendidik', label: 'Tenaga Pendidik', icon: Users },
    { to: '/aplikasi', label: 'Aplikasi Sekolah', icon: ExternalLink },
    { to: '/kontak', label: 'Kontak', icon: MapPin },
    { to: '/saran', label: 'Kotak Saran', icon: MessageSquare },
  ]

  return (
    <footer className="bg-dark text-white/70">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              {pengaturan?.logo_url ? (
                <img src={pengaturan.logo_url} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-white/10 p-1" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-display font-bold text-white text-base sm:text-lg leading-tight">SMP Negeri 3 Besuki</p>
                <p className="text-xs text-white/50">Pendidikan Berkualitas</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4 hidden sm:block">
              {pengaturan?.tagline || 'Mendidik dengan hati, berprestasi dengan karakter.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {pengaturan?.instagram_url && (
                <a href={pengaturan.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {pengaturan?.youtube_url && (
                <a href={pengaturan.youtube_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              )}
              {pengaturan?.facebook_url && (
                <a href={pengaturan.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {pengaturan?.tiktok_url && (
                <a href={pengaturan.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors" aria-label="TikTok">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-3 sm:mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-secondary" />
              Tautan Cepat
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm hover:text-secondary transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: More Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-3 sm:mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-secondary" />
              Lainnya
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.slice(4).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm hover:text-secondary transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-display font-bold text-white mb-3 sm:mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              Hubungi Kami
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {pengaturan?.alamat && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{pengaturan.alamat}</span>
                </li>
              )}
              {pengaturan?.telepon && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-white/40 shrink-0" />
                  <a href={`tel:${pengaturan.telepon}`} className="hover:text-secondary transition-colors truncate">
                    {pengaturan.telepon}
                  </a>
                </li>
              )}
              {pengaturan?.email && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-white/40 shrink-0" />
                  <a href={`mailto:${pengaturan.email}`} className="hover:text-secondary transition-colors truncate text-xs sm:text-sm">
                    {pengaturan.email}
                  </a>
                </li>
              )}
              {pengaturan?.jam_operasional && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-white/40 shrink-0" />
                  <span className="text-xs sm:text-sm">{pengaturan.jam_operasional}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-xs sm:text-sm text-white/60 text-center sm:text-left">
            <span>© {new Date().getFullYear()} SMP Negeri 3 Besuki</span>
            {totalKunjungan !== null && (
              <span className="text-[10px] sm:text-xs bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                👁 {totalKunjungan.toLocaleString('id-ID')} Pengunjung
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-white/40 flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary inline fill-secondary" /> untuk pendidikan Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
