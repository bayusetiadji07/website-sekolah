import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'
import { Megaphone, Clock, Pin, Calendar, Download, ExternalLink, FileText } from 'lucide-react'

export default function Pengumuman() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    supabase
      .from('pengumuman')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data, count }) => {
        setData(data || [])
        setTotal(count || 0)
        setLoading(false)
      })
  }, [])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Pengumuman</span>
          </div>
          <h1>Pengumuman</h1>
          <p>{total} pengumuman</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Pinned/Priority Announcements - Featured Layout */}
        {!loading && data.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Pin className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-bold text-xl">Pengumuman Penting</h2>
            </div>
            <div className="space-y-5">
              {data.slice(0, 2).map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    {p.foto_url && (
                      <div className="md:w-72 lg:w-80 shrink-0 bg-gray-100">
                        <img
                          src={p.foto_url}
                          alt={p.judul}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    {/* Content Section */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="badge badge-secondary">Penting</span>
                        <span className="flex items-center gap-1 text-xs text-ink-light">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(p.created_at)}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-ink mb-3 leading-tight">
                        {p.judul}
                      </h3>
                      <p className="text-ink-light leading-relaxed mb-4">
                        {p.isi}
                      </p>
                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {p.link_url && (
                          <a
                            href={p.link_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors"
                          >
                            Baca Selengkapnya
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {p.file_url && (
                          <a
                            href={p.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Unduh Lampiran
                          </a>
                        )}
                        {!p.link_url && !p.file_url && (
                          <span className="inline-flex items-center gap-2 text-ink-light text-sm">
                            <FileText className="w-4 h-4" />
                            Tidak ada tautan atau lampiran
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Announcements - List Layout */}
        {!loading && data.length > 2 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title !mb-0 !text-xl">
                Semua <span>Pengumuman</span>
              </h2>
              <span className="text-sm text-ink-light flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {total} total
              </span>
            </div>
            <div className="space-y-4">
              {data.slice(2).map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-ink/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image - smaller for list items */}
                    {p.foto_url && (
                      <div className="sm:w-40 shrink-0 bg-gray-100">
                        <img
                          src={p.foto_url}
                          alt={p.judul}
                          className="w-full h-32 sm:h-full object-cover"
                        />
                      </div>
                    )}
                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="badge badge-primary">Pengumuman</span>
                        <span className="flex items-center gap-1 text-xs text-ink-light">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(p.created_at)}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-ink mb-2 leading-tight">
                        {p.judul}
                      </h3>
                      <p className="text-sm text-ink-light leading-relaxed line-clamp-2 mb-3">
                        {p.isi}
                      </p>
                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {p.link_url && (
                          <a
                            href={p.link_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary-dark transition-colors"
                          >
                            Baca Selengkapnya <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {p.file_url && (
                          <a
                            href={p.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Lampiran
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3>Belum Ada Pengumuman</h3>
            <p>Pengumuman terbaru akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && <SkeletonList count={3} />}
      </div>
    </div>
  )
}
