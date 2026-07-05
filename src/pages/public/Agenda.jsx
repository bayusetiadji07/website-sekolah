import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function formatTanggal(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Agenda() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('agenda')
      .select('*')
      .eq('status', 'published')
      .order('tanggal_mulai', { ascending: true })
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const mendatang = items.filter((a) => (a.tanggal_selesai || a.tanggal_mulai) >= today)
  const lampau = items.filter((a) => (a.tanggal_selesai || a.tanggal_mulai) < today)

  function Card({ a }) {
    return (
      <article className="bg-white border border-ink/10 rounded-lg p-5 flex gap-4">
        <div className="shrink-0 w-16 text-center">
          <div className="bg-chalkboard text-paper rounded-lg py-2">
            <p className="text-xs uppercase">{new Date(a.tanggal_mulai).toLocaleDateString('id-ID', { month: 'short' })}</p>
            <p className="text-xl font-display font-bold text-amber">{new Date(a.tanggal_mulai).getDate()}</p>
          </div>
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">{a.judul}</h3>
          <p className="text-xs text-rust font-medium mb-1">
            {formatTanggal(a.tanggal_mulai)}
            {a.tanggal_selesai && a.tanggal_selesai !== a.tanggal_mulai ? ` – ${formatTanggal(a.tanggal_selesai)}` : ''}
            {a.lokasi ? ` · ${a.lokasi}` : ''}
          </p>
          {a.deskripsi && <p className="text-sm text-ink/70 whitespace-pre-line">{a.deskripsi}</p>}
        </div>
      </article>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Agenda Kegiatan</h1>
      <div className="chalk-divider w-24 mb-8" />

      {loading && <p className="text-ink/60">Memuat...</p>}
      {!loading && items.length === 0 && <p className="text-ink/60">Belum ada agenda kegiatan.</p>}

      {mendatang.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold mb-4">Akan Datang</h2>
          <div className="space-y-4">
            {mendatang.map((a) => <Card key={a.id} a={a} />)}
          </div>
        </section>
      )}

      {lampau.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold mb-4 text-ink/60">Sudah Berlalu</h2>
          <div className="space-y-4 opacity-70">
            {lampau.map((a) => <Card key={a.id} a={a} />)}
          </div>
        </section>
      )}
    </div>
  )
}
