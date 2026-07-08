import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ExternalLink, BookOpen, ArrowRight } from 'lucide-react'

export default function Aplikasi() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('app_links')
      .select('*')
      .eq('aktif', true)
      .order('urutan', { ascending: true })
      .then(({ data }) => {
        setData(data || [])
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
            <span className="text-white/60">Aplikasi</span>
          </div>
          <h1>Aplikasi Sekolah</h1>
          <p>Akses berbagai aplikasi resmi sekolah</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Intro */}
        {data.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg mb-1">Platform Digital Sekolah</h2>
                <p className="text-sm text-ink-light">
                  Akses aplikasi resmi yang digunakan sekolah untuk asesmen, administrasi, dan kegiatan pembelajaran.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3>Belum Ada Aplikasi</h3>
            <p>Aplikasi sekolah akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && data.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {data.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="card p-5 flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {a.ikon_url ? (
                    <img src={a.ikon_url} alt={a.nama} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="font-display font-bold text-2xl text-primary">{a.nama?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-base mb-1 flex items-center gap-2">
                    {a.nama}
                    <ExternalLink className="w-3.5 h-3.5 text-ink-light" />
                  </h3>
                  {a.deskripsi && <p className="text-sm text-ink-light">{a.deskripsi}</p>}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-ink-light mb-4">Butuh bantuan dalam mengakses aplikasi?</p>
          <Link to="/kontak" className="btn btn-outline">
            Hubungi Kami
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
