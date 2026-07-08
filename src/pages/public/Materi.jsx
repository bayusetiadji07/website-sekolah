import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonRows } from '../../components/Skeleton'
import { BookOpen, Download, ExternalLink, Filter } from 'lucide-react'

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
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Materi</span>
          </div>
          <h1>Materi Pembelajaran</h1>
          <p>{data.length} materi tersedia</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm text-ink-light">
            <Filter className="w-4 h-4" />
            Filter:
          </div>
          <select
            value={filterMapel}
            onChange={(e) => setFilterMapel(e.target.value)}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Semua Mapel</option>
            {mapelList.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border border-ink/15 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          {(filterMapel || filterKelas) && (
            <button
              onClick={() => { setFilterMapel(''); setFilterKelas('') }}
              className="text-sm text-secondary hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && <SkeletonRows count={4} />}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3>Belum Ada Materi</h3>
            <p>Materi pembelajaran akan ditampilkan di sini.</p>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge badge-primary">{m.mapel}</span>
                  {m.kelas && <span className="badge badge-outline">{m.kelas}</span>}
                </div>
                <h3 className="font-display font-bold text-base truncate">{m.judul}</h3>
              </div>
              {m.file_url && (
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary text-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  Unduh
                </a>
              )}
              {!m.file_url && m.link_url && (
                <a
                  href={m.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline text-sm whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
