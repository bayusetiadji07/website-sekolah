import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Target, Rocket, CheckCircle2, ArrowRight } from 'lucide-react'

export default function VisiMisi() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('visi, misi').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const misiList = (p?.misi || '').split('\n').map((s) => s.trim()).filter(Boolean)

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/profil/visi-misi" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Visi & Misi</span>
          </div>
          <h1>Visi & Misi</h1>
          <p>Landasan dan arah pembangunan sekolah</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Visi Card */}
        <div className="card overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-secondary to-secondary-dark p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Visi</p>
                <h2 className="font-display font-bold text-xl">Visibili Masa Depan</h2>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-ink leading-relaxed text-lg whitespace-pre-line">
              {p?.visi || 'Visi sekolah belum diisi.'}
            </p>
          </div>
        </div>

        {/* Misi Card */}
        <div className="card overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-accent to-accent-light p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/70 text-sm uppercase tracking-wider font-semibold">Misi</p>
                <h2 className="font-display font-bold text-xl">Langkah Strategis</h2>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {misiList.length > 0 ? (
              <ul className="space-y-4">
                {misiList.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-ink leading-relaxed">{m}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-light italic">Misi sekolah belum diisi.</p>
            )}
          </div>
        </div>

        {/* Decorative element */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <Target className="w-6 h-6 text-secondary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-ink-light mb-4">Ingin tahu lebih banyak tentang sekolah?</p>
          <Link to="/profil/sejarah" className="btn btn-primary">
            Lihat Sejarah Sekolah
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
