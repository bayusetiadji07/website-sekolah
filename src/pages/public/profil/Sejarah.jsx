import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Sejarah() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('sejarah, foto_sekolah_url').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-8" />

      <h2 className="font-display text-xl font-bold mb-3">Sejarah Sekolah</h2>
      {p?.foto_sekolah_url && (
        <img src={p.foto_sekolah_url} alt="Foto sekolah" className="w-full h-64 object-cover rounded-lg mb-6" />
      )}
      <div className="bg-white border border-ink/10 rounded-lg shadow-sm p-6">
        <p className="text-ink/80 whitespace-pre-line">{p?.sejarah || 'Sejarah sekolah belum diisi.'}</p>
      </div>
    </div>
  )
}
