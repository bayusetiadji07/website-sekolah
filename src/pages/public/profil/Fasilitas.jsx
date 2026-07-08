import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { SkeletonBlock } from '../../../components/Skeleton'
import { Building2, CheckCircle, ArrowRight } from 'lucide-react'

export default function Fasilitas() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('fasilitas').select('*').eq('aktif', true).order('urutan')
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
            <Link to="/profil/fasilitas" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Fasilitas</span>
          </div>
          <h1>Fasilitas Sekolah</h1>
          <p>{data.length} fasilitas tersedia</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Building2 className="w-8 h-8" />
            </div>
            <h3>Belum Ada Fasilitas</h3>
            <p>Informasi fasilitas akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonBlock key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && data.length > 0 && (
          <>
            <p className="text-ink-light mb-8 max-w-2xl">
              SMP Negeri 3 Besuki menyediakan berbagai fasilitas pendukung pembelajaran yang modern dan memadai untuk kenyamanan siswa.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.map((f) => (
                <div key={f.id} className="card group overflow-hidden">
                  {f.foto_url && (
                    <div className="card-image-wrapper aspect-video">
                      <img src={f.foto_url} alt={f.nama} className="card-image" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-secondary" />
                      </div>
                      <h3 className="font-display font-bold text-lg">{f.nama}</h3>
                    </div>
                    {f.deskripsi && (
                      <p className="text-sm text-ink-light leading-relaxed">{f.deskripsi}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-ink/5 flex items-center gap-1.5 text-xs text-accent">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Tersedia
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        {data.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-ink-light mb-4">Ingin mengetahui lebih lanjut?</p>
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
