import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function GaleriMarquee() {
  const [items, setItems] = useState([])

  useEffect(() => {
    supabase
      .from('galeri')
      .select('*')
      .eq('aktif', true)
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data }) => setItems(data || []))
  }, [])

  if (items.length === 0) return null

  const track = [...items, ...items]

  return (
    <section className="bg-white py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Galeri Sekolah</h2>
        <Link to="/galeri" className="text-sm text-rust font-medium hover:underline shrink-0">
          Lihat semua →
        </Link>
      </div>
      <div className="marquee-mask">
        <div className="flex gap-4 marquee-track w-max">
          {track.map((g, i) => (
            <div key={`${g.id}-${i}`} className="w-56 h-40 shrink-0 rounded-lg overflow-hidden border border-ink/10 shadow-sm">
              <img src={g.foto_url} alt={g.judul} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
