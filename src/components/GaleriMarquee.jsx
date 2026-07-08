import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Image, ArrowRight } from 'lucide-react'

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
    <section className="bg-gradient-to-b from-white to-paper py-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Image className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="font-display text-2xl font-bold">Galeri Sekolah</h2>
        </div>
        <Link
          to="/galeri"
          className="read-more shrink-0"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="marquee-mask">
        <div className="flex gap-4 marquee-track w-max">
          {track.map((g, i) => (
            <div
              key={`${g.id}-${i}`}
              className="w-56 h-40 shrink-0 rounded-xl overflow-hidden border border-ink/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={g.foto_url} alt={g.judul} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
