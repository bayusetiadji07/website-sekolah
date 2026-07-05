import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import TentangKamiTabs from '../../../components/TentangKamiTabs'

export default function VisiMisi() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('visi, misi').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  const misiList = (p?.misi || '').split('\n').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-6" />
      <TentangKamiTabs />

      <div className="grid md:grid-cols-2 gap-6">
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
    </div>
  )
}
