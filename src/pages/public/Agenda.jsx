import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonRows } from '../../components/Skeleton'
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react'

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

  function AgendaCard({ a, isPast }) {
    return (
      <article className={`card p-5 flex gap-4 ${isPast ? 'opacity-70' : ''}`}>
        <div className="shrink-0 w-16 text-center">
          <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-xl py-3 shadow-sm">
            <p className="text-xs uppercase font-semibold opacity-80">
              {new Date(a.tanggal_mulai).toLocaleDateString('id-ID', { month: 'short' })}
            </p>
            <p className="text-2xl font-display font-extrabold">
              {new Date(a.tanggal_mulai).getDate()}
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg mb-1">{a.judul}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-light mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatTanggal(a.tanggal_mulai)}
              {a.tanggal_selesai && a.tanggal_selesai !== a.tanggal_mulai ? ` – ${formatTanggal(a.tanggal_selesai)}` : ''}
            </span>
            {a.lokasi && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {a.lokasi}
              </span>
            )}
          </div>
          {a.deskripsi && <p className="text-sm text-ink-light whitespace-pre-line mb-3">{a.deskripsi}</p>}
          {a.foto_url && (
            <img src={a.foto_url} alt={a.judul} className="w-full max-h-48 object-cover rounded-lg" />
          )}
        </div>
      </article>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Agenda</span>
          </div>
          <h1>Agenda Kegiatan</h1>
          <p>Jadwal kegiatan sekolah sepanjang tahun</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Loading */}
        {loading && <SkeletonRows count={3} />}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar className="w-8 h-8" />
            </div>
            <h3>Belum Ada Agenda</h3>
            <p>Agenda kegiatan akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Upcoming */}
        {mendatang.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="section-title !mb-0">Akan Datang</h2>
            </div>
            <div className="space-y-4">
              {mendatang.map((a) => <AgendaCard key={a.id} a={a} isPast={false} />)}
            </div>
          </section>
        )}

        {/* Past */}
        {lampau.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <h2 className="section-title !mb-0 !text-ink-light">Sudah Berlalu</h2>
            </div>
            <div className="space-y-4">
              {lampau.map((a) => <AgendaCard key={a.id} a={a} isPast />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
