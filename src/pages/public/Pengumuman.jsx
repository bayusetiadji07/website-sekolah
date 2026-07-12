import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'
import { Megaphone, Clock, Pin, Calendar, Download, ExternalLink, FileText } from 'lucide-react'

export default function Pengumuman() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const location = useLocation()
  const itemRefs = useRef({})

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

  // Scroll ke pengumuman yang dipilih dari beranda
  useEffect(() => {
    if (!loading && data.length > 0) {
      const hash = location.hash
      if (hash && hash.startsWith('#ann-')) {
        const id = hash.replace('#ann-', '')
        setTimeout(() => {
          const element = document.getElementById(`ann-${id}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            element.classList.add('ring-2', 'ring-secondary', 'ring-offset-2')
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-secondary', 'ring-offset-2')
            }, 3000)
          }
        }, 100)
      }
    }
  }, [loading, data, location.hash])

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

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        {/* Pinned/Priority Announcements - Full Width Image on Top */}
        {!loading && data.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Pin className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-bold text-xl">Pengumuman Penting</h2>
            </div>
            <div className="space-y-6">
              {data.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  id={`ann-${p.id}`}
                  ref={(el) => (itemRefs.current[p.id] = el)}
                  className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Image - Full Width on Top */}
                  {p.foto_url && (
                    <div className="w-full bg-gray-100">
                      <img
                        src={p.foto_url}
                        alt={p.judul}
                        className="w-full h-auto object-contain max-h-[500px]"
                      />
                    </div>
                  )}
                  {/* Content Below Image */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="badge badge-secondary">Penting</span>
                      <span className="flex items-center gap-1.5 text-sm text-ink-light">
                        <Calendar className="w-4 h-4" />
                        {formatDate(p.created_at)}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-ink mb-4 leading-tight">
                      {p.judul}
                    </h3>
                    <div className="rich-content text-ink-light text-base mb-6" dangerouslySetInnerHTML={{ __html: p.isi }} />
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-ink/10">
                      {p.link_url && (
                        <a
                          href={p.link_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors"
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
                          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
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
              ))}
            </div>
          </div>
        )}

        {/* All Announcements - Full Width Image on Top */}
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
            <div className="space-y-5">
              {data.slice(2).map((p) => (
                <div
                  key={p.id}
                  id={`ann-${p.id}`}
                  ref={(el) => (itemRefs.current[p.id] = el)}
                  className="bg-white rounded-xl border border-ink/10 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Image - Full Width on Top */}
                  {p.foto_url && (
                    <div className="w-full bg-gray-100">
                      <img
                        src={p.foto_url}
                        alt={p.judul}
                        className="w-full h-auto object-contain max-h-[400px]"
                      />
                    </div>
                  )}
                  {/* Content Below Image */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="badge badge-primary">Pengumuman</span>
                      <span className="flex items-center gap-1.5 text-sm text-ink-light">
                        <Calendar className="w-4 h-4" />
                        {formatDate(p.created_at)}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-ink mb-3 leading-tight">
                      {p.judul}
                    </h3>
                    <div className="rich-content text-ink-light mb-4" dangerouslySetInnerHTML={{ __html: p.isi }} />
                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-ink/5">
                      {p.link_url && (
                        <a
                          href={p.link_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary-dark transition-colors"
                        >
                          Baca Selengkapnya <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {p.file_url && (
                        <a
                          href={p.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Lampiran
                        </a>
                      )}
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
