import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function GaleriGrid({ kategori, title, emptyText }) {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    supabase
      .from('galeri')
      .select('*')
      .eq('aktif', true)
      .eq('kategori', kategori)
      .order('urutan', { ascending: true })
      .then(({ data }) => setItems(data || []))
  }, [kategori])

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
      <div className="chalk-divider w-24 mb-8" />

      {items.length === 0 && <p className="text-ink/60">{emptyText}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g)}
            className="block aspect-square overflow-hidden rounded-lg border border-ink/10 group"
          >
            <img
              src={g.foto_url}
              alt={g.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-5"
          onClick={() => setActive(null)}
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active.foto_url} alt={active.judul} className="w-full max-h-[75vh] object-contain rounded-lg" />
            <div className="text-paper mt-3">
              <p className="font-display font-bold">{active.judul}</p>
              {active.keterangan && <p className="text-sm text-paper/70">{active.keterangan}</p>}
            </div>
            <button
              onClick={() => setActive(null)}
              className="mt-3 text-amber text-sm underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
