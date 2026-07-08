import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Handshake, ArrowRight, ExternalLink } from 'lucide-react'

export default function Kemitraan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('kemitraan').select('*').eq('aktif', true).order('urutan')
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
            <Link to="/profil/kemitraan" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Kemitraan</span>
          </div>
          <h1>Kemitraan Sekolah</h1>
          <p>{data.length} mitra合作 sekolah</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Intro */}
        {data.length > 0 && (
          <div className="glass-card rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Handshake className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg mb-1">Kerja Sama Strategis</h2>
              <p className="text-sm text-ink-light">
                SMP Negeri 3 Besuki menjalin kerja sama dengan berbagai pihak untuk mendukung kualitas pendidikan.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Handshake className="w-8 h-8" />
            </div>
            <h3>Belum Ada Kemitraan</h3>
            <p>Informasi kemitraan akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && data.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((k) => {
              const card = (
                <div className="card p-5 flex items-start gap-4 h-full">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center shrink-0">
                    {k.logo_url ? (
                      <img src={k.logo_url} alt={k.nama} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="font-display font-bold text-2xl text-primary">{k.nama?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base mb-1">{k.nama}</h3>
                    {k.deskripsi && (
                      <p className="text-sm text-ink-light leading-relaxed">{k.deskripsi}</p>
                    )}
                    {k.url && (
                      <a
                        href={k.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark mt-2 font-medium"
                      >
                        Kunjungi
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )

              return k.url ? (
                <a key={k.id} href={k.url} target="_blank" rel="noreferrer" className="block">
                  {card}
                </a>
              ) : (
                <div key={k.id}>{card}</div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {data.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-ink-light mb-4">Tertarik menjadi mitra kami?</p>
            <Link to="/kontak" className="btn btn-primary">
              Hubungi Kami
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
