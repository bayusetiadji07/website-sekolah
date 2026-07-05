import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Materi() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMapel, setFilterMapel] = useState('')
  const [filterKelas, setFilterKelas] = useState('')

  useEffect(() => {
    supabase
      .from('materi')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setData(data || [])
        setLoading(false)
      })
  }, [])

  const mapelList = [...new Set(data.map((m) => m.mapel).filter(Boolean))]
  const kelasList = [...new Set(data.map((m) => m.kelas).filter(Boolean))]

  const filtered = data.filter(
    (m) =>
      (!filterMapel || m.mapel === filterMapel) &&
      (!filterKelas || m.kelas === filterKelas)
  )

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Materi Pembelajaran</h1>
      <div className="chalk-divider w-24 mb-8" />

      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={filterMapel}
          onChange={(e) => setFilterMapel(e.target.value)}
          className="border border-ink/20 rounded px-3 py-2 text-sm bg-white"
        >
          <option value="">Semua Mapel</option>
          {mapelList.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
          className="border border-ink/20 rounded px-3 py-2 text-sm bg-white"
        >
          <option value="">Semua Kelas</option>
          {kelasList.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-ink/70">Memuat...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-ink/70">Belum ada materi yang cocok.</p>
      )}

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs text-rust font-medium">{m.mapel} · {m.kelas}</p>
              <h3 className="font-display font-bold">{m.judul}</h3>
            </div>
            {m.file_url && (
              <a
                href={m.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm bg-chalkboard text-paper px-4 py-2 rounded hover:opacity-90 whitespace-nowrap"
              >
                Unduh File
              </a>
            )}
            {!m.file_url && m.link_url && (
              <a
                href={m.link_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm border border-chalkboard px-4 py-2 rounded hover:bg-chalkboard hover:text-paper whitespace-nowrap"
              >
                Buka Link
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
