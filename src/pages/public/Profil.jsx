import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Profil() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const misiList = (p?.misi || '').split('\n').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Profil Sekolah</h1>
      <div className="chalk-divider w-24 mb-8" />

      {p?.foto_sekolah_url && (
        <img src={p.foto_sekolah_url} alt="Foto sekolah" className="w-full h-64 object-cover rounded-lg mb-10" />
      )}

      <section className="mb-10">
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
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <section className="bg-white border border-ink/10 rounded-lg p-6">
          <h2 className="font-display text-xl font-bold mb-3">Visi</h2>
          <p className="text-ink/80 whitespace-pre-line">{p?.visi || 'Visi sekolah belum diisi.'}</p>
        </section>
        <section className="bg-white border border-ink/10 rounded-lg p-6">
          <h2 className="font-display text-xl font-bold mb-3">Misi</h2>
          {misiList.length > 0 ? (
            <ol className="list-decimal list-inside text-ink/80 space-y-1">
              {misiList.map((m, i) => <li key={i}>{m}</li>)}
            </ol>
          ) : (
            <p className="text-ink/80">Misi sekolah belum diisi.</p>
          )}
        </section>
      </div>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Sejarah Singkat</h2>
        <div className="bg-white border border-ink/10 rounded-lg p-6">
          <p className="text-ink/80 whitespace-pre-line">{p?.sejarah || 'Sejarah sekolah belum diisi.'}</p>
        </div>
      </section>
    </div>
  )
}
