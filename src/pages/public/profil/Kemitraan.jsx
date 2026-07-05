import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Kemitraan() {
  const [data, setData] = useState([])

  useEffect(() => {
    supabase.from('kemitraan').select('*').eq('aktif', true).order('urutan')
      .then(({ data }) => setData(data || []))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-8" />

      <h2 className="font-display text-xl font-bold mb-4">Kemitraan Sekolah</h2>
      {data.length === 0 ? (
        <p className="text-ink/60">Belum ada data kemitraan.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {data.map((k) => {
            const content = (
              <div className="bg-white border border-ink/10 rounded-lg p-5 flex items-center gap-4 h-full hover:border-amber transition-colors">
                {k.logo_url ? (
                  <img src={k.logo_url} alt={k.nama} className="w-14 h-14 object-contain shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard shrink-0">
                    {k.nama?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-display font-bold">{k.nama}</p>
                  {k.deskripsi && <p className="text-sm text-ink/60">{k.deskripsi}</p>}
                </div>
              </div>
            )
            return k.url ? (
              <a key={k.id} href={k.url} target="_blank" rel="noreferrer">{content}</a>
            ) : (
              <div key={k.id}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
