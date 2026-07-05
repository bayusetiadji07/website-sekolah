import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import TentangKamiTabs from '../../../components/TentangKamiTabs'

export default function Sambutan() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah')
      .select('sambutan_kepala_sekolah, nama_kepala_sekolah, foto_kepala_sekolah_url')
      .eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-6" />
      <TentangKamiTabs />

      <h2 className="font-display text-xl font-bold mb-3">Sambutan Kepala Sekolah</h2>
      <div className="bg-white border border-ink/10 rounded-lg p-6 flex flex-col sm:flex-row gap-5">
        {p?.foto_kepala_sekolah_url && (
          <img src={p.foto_kepala_sekolah_url} alt={p?.nama_kepala_sekolah} className="w-24 h-24 rounded-full object-cover shrink-0" />
        )}
        <div>
          <p className="text-ink/80 whitespace-pre-line mb-3">
            {p?.sambutan_kepala_sekolah || 'Sambutan kepala sekolah belum diisi.'}
          </p>
          {p?.nama_kepala_sekolah && (
            <p className="font-display font-bold">{p.nama_kepala_sekolah}</p>
          )}
        </div>
      </div>
    </div>
  )
}
