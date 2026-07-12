import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Quote, GraduationCap } from 'lucide-react'

export default function Sambutan() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah')
      .select('sambutan_kepala_sekolah, nama_kepala_sekolah, foto_kepala_sekolah_url')
      .eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/profil/sambutan" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Sambutan</span>
          </div>
          <h1>Sambutan Kepala Sekolah</h1>
          <p> kata-kata motivasi dari pimpinan sekolah</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">
        {/* Principal Card */}
        <div className="card overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-primary to-primary-light p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Kepala Sekolah</p>
                <h2 className="font-display font-bold text-xl">
                  {p?.nama_kepala_sekolah || 'Nama Kepala Sekolah'}
                </h2>
              </div>
            </div>
          </div>

          {/* Photo and Quote */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {p?.foto_kepala_sekolah_url && (
                <div className="shrink-0">
                  <img
                    src={p.foto_kepala_sekolah_url}
                    alt={p?.nama_kepala_sekolah}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg mx-auto sm:mx-0"
                  />
                </div>
              )}
              <div className="flex-1">
                <Quote className="w-10 h-10 text-secondary/20 mb-3" />
                {p?.sambutan_kepala_sekolah ? (
                  <div className="rich-content text-ink text-lg italic" dangerouslySetInnerHTML={{ __html: p.sambutan_kepala_sekolah }} />
                ) : (
                  <p className="text-ink-light italic">Sambutan kepala sekolah belum diisi.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Box */}
        <div className="quote-box text-center">
          <p className="text-lg font-medium">
            "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia."
          </p>
          <p className="text-sm text-ink-light mt-2">— Nelson Mandela</p>
        </div>

        {/* Back to About */}
        <div className="mt-8 text-center">
          <Link to="/profil/sejarah" className="read-more">
            ← Kembali ke Tentang Kami
          </Link>
        </div>
      </div>
    </div>
  )
}
