import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'

export default function Berita() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('berita_kegiatan')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setData(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Berita & Kegiatan</h1>
      <div className="chalk-divider w-24 mb-8" />

      {loading && <SkeletonList count={4} cols="md:grid-cols-2" />}
      {!loading && data.length === 0 && (
        <p className="text-ink/70">Belum ada berita.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((b) => (
          <article key={b.id} className="bg-white border border-ink/10 rounded-lg shadow-sm overflow-hidden">
            {b.foto_url && (
              <img src={b.foto_url} alt={b.judul} className="w-full h-44 object-cover" />
            )}
            <div className="p-5">
              <p className="text-xs text-rust font-medium mb-2">
                {new Date(b.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              <h2 className="font-display font-bold text-lg mb-2">{b.judul}</h2>
              <p className="text-ink/80 text-sm whitespace-pre-line">{b.isi}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
