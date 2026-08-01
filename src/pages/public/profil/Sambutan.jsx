import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Quote, GraduationCap } from 'lucide-react'
import { markDropCap } from '../../../lib/richText'

export default function Sambutan() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah')
      .select('sambutan_kepala_sekolah, nama_kepala_sekolah, foto_kepala_sekolah_url')
      .eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const isiSambutan = useMemo(
    () => markDropCap(p?.sambutan_kepala_sekolah),
    [p?.sambutan_kepala_sekolah]
  )

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
        <article className="card overflow-hidden">
          {/* Pita gradien sebagai latar potret */}
          <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-8 pb-24 text-center text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Sambutan</p>
            <h2 className="font-display font-bold text-2xl mt-1">Kepala Sekolah</h2>
          </div>

          {/* Potret resmi, rasio 4:5, menumpang di batas pita */}
          <div className="px-6 sm:px-10 -mt-20 text-center">
            {p?.foto_kepala_sekolah_url ? (
              <img
                src={p.foto_kepala_sekolah_url}
                alt={p?.nama_kepala_sekolah}
                className="w-44 sm:w-52 aspect-[4/5] object-cover rounded-2xl mx-auto shadow-xl ring-4 ring-white"
              />
            ) : (
              <div className="w-44 sm:w-52 aspect-[4/5] rounded-2xl mx-auto shadow-xl ring-4 ring-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <GraduationCap className="w-14 h-14 text-white" />
              </div>
            )}
            <p className="font-display font-bold text-xl text-ink mt-5">
              {p?.nama_kepala_sekolah || 'Nama Kepala Sekolah'}
            </p>
            <p className="text-sm text-ink-light">Kepala Sekolah SMP Negeri 3 Besuki</p>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-secondary to-sunny" />
          </div>

          {/* Isi sambutan: selebar penuh, tegak, dengan drop cap */}
          <div className="px-6 sm:px-10 pt-8 pb-6">
            <Quote className="w-9 h-9 text-secondary/25 mb-2" />
            {p?.sambutan_kepala_sekolah ? (
              <div
                className="rich-content sambutan-body"
                dangerouslySetInnerHTML={{ __html: isiSambutan }}
              />
            ) : (
              <p className="text-ink-light italic">Sambutan kepala sekolah belum diisi.</p>
            )}
          </div>

          {/* Blok tanda tangan ala surat resmi */}
          {p?.nama_kepala_sekolah && (
            <div className="px-6 sm:px-10 pb-8 pt-5 border-t border-ink/10 text-right">
              <p className="text-sm text-ink-light">Hormat kami,</p>
              <p className="font-display font-bold text-lg text-primary mt-1">
                {p.nama_kepala_sekolah}
              </p>
              <p className="text-sm text-ink-light">Kepala Sekolah</p>
            </div>
          )}
        </article>

        {/* Quote Box */}
        <div className="quote-box text-center mt-10">
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
