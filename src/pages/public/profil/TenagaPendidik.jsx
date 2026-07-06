import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function TenagaPendidik() {
  const [data, setData] = useState([])

  useEffect(() => {
    supabase.from('tenaga_pendidik').select('*').eq('aktif', true).order('urutan')
      .then(({ data }) => setData(data || []))
  }, [])

  const pendidik = data.filter((d) => d.kategori === 'pendidik')
  const kependidikan = data.filter((d) => d.kategori === 'kependidikan')

  function Grid({ items }) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((t) => (
          <div key={t.id} className="bg-white border border-ink/10 rounded-lg shadow-sm p-5 text-center">
            {t.foto_url ? (
              <img src={t.foto_url} alt={t.nama} className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard mx-auto mb-3">
                {t.nama?.[0]}
              </div>
            )}
            <p className="font-display font-bold">{t.nama}</p>
            <p className="text-sm text-ink/70">{t.jabatan}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-8" />

      <h2 className="font-display text-xl font-bold mb-4">Tenaga Pendidik</h2>
      {pendidik.length === 0 ? (
        <p className="text-ink/70 mb-10">Belum ada data.</p>
      ) : (
        <div className="mb-10"><Grid items={pendidik} /></div>
      )}

      <h2 className="font-display text-xl font-bold mb-4">Tenaga Kependidikan</h2>
      {kependidikan.length === 0 ? (
        <p className="text-ink/70">Belum ada data.</p>
      ) : (
        <Grid items={kependidikan} />
      )}
    </div>
  )
}
