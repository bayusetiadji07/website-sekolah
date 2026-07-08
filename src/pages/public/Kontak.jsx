import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { buildMapsEmbedSrc } from '../../lib/maps'
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from 'lucide-react'

export default function Kontak() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const mapsSrc = buildMapsEmbedSrc(p?.maps_embed_url, p?.alamat)

  const contactItems = [
    { icon: MapPin, label: 'Alamat', value: p?.alamat, href: null },
    { icon: Phone, label: 'Telepon', value: p?.telepon, href: p?.telepon ? `tel:${p.telepon}` : null },
    { icon: Mail, label: 'Email', value: p?.email, href: p?.email ? `mailto:${p.email}` : null },
    { icon: Clock, label: 'Jam Operasional', value: p?.jam_operasional || 'Senin - Jumat: 07.00 - 15.00 WIB', href: null },
  ].filter((i) => i.value)

  const socials = [
    { label: 'Instagram', value: p?.instagram_url, color: 'hover:bg-pink-500' },
    { label: 'Facebook', value: p?.facebook_url, color: 'hover:bg-blue-600' },
    { label: 'YouTube', value: p?.youtube_url, color: 'hover:bg-red-600' },
    { label: 'TikTok', value: p?.tiktok_url, color: 'hover:bg-black' },
  ].filter((s) => s.value)

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Kontak</span>
          </div>
          <h1>Hubungi Kami</h1>
          <p>Jangan ragu untuk menghubungi kami</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <div className="card p-6 mb-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-light uppercase tracking-wider font-semibold mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-ink hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-ink">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  Media Sosial
                </h2>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.value}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-colors hover:text-white ${s.color}`}
                    >
                      <SocialIcon name={s.label.toLowerCase()} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6">
              <Link to="/saran" className="btn btn-secondary w-full justify-center">
                <MessageSquare className="w-4 h-4" />
                Kirim Saran
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden min-h-80">
            {mapsSrc ? (
              <iframe
                src={mapsSrc}
                className="w-full h-full min-h-96"
                loading="lazy"
                title="Lokasi Sekolah"
              />
            ) : (
              <div className="w-full h-96 flex flex-col items-center justify-center text-center p-8">
                <MapPin className="w-12 h-12 text-ink/20 mb-4" />
                <p className="text-ink-light">Peta lokasi belum ditambahkan.</p>
                {p?.alamat && (
                  <p className="text-sm text-ink-light mt-2">{p.alamat}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple social icon component
function SocialIcon({ name, className }) {
  const icons = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298 0 .593.036.88.103V9.4a6.33 6.33 0 00-.88-.064A6.34 6.34 0 006.18 15.7a6.34 6.34 0 006.33 6.33 6.34 6.34 0 006.33-6.33V8.96a8.27 8.27 0 004.84 1.55V6.84a4.86 4.86 0 01-1.09-.15z" />
      </svg>
    ),
  }
  return icons[name] || null
}
