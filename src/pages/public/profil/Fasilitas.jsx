import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Fasilitas() {
  const [data, setData] = useState([])

  useEffect(() => {
    supabase.from('fasilitas').select('*').eq('aktif', true).order('urutan')
      .then(({ data }) => setData(data || []))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-8" />

      <h2 className="font-display text-xl font-bold mb-4">Fasilitas Sekolah</h2>
      {data.length === 0 ? (
        <p className="text-ink/60">Belum ada data fasilitas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {data.map((f) => (
            <div key={f.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
              {f.foto_url && <img src={f.foto_url} alt={f.nama} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <p className="font-display font-bold mb-1">{f.nama}</p>
                {f.deskripsi && <p className="text-sm text-ink/60">{f.deskripsi}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
