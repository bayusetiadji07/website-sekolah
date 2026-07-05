import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Pengumuman() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('pengumuman')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setData(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Pengumuman</h1>
      <div className="chalk-divider w-24 mb-8" />

      {loading && <p className="text-ink/60">Memuat...</p>}
      {!loading && data.length === 0 && (
        <p className="text-ink/60">Belum ada pengumuman.</p>
      )}

      <div className="space-y-5">
        {data.map((p) => (
          <article key={p.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
            {p.foto_url && (
              <img src={p.foto_url} alt={p.judul} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <p className="text-xs text-rust font-medium mb-2">
                {new Date(p.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              <h2 className="font-display font-bold text-xl mb-2">{p.judul}</h2>
              <p className="text-ink/80 whitespace-pre-line">{p.isi}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
