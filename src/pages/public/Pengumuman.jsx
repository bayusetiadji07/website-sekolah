import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'
import ArticleCard from '../../components/ArticleCard'
import { Megaphone, Clock, Pin } from 'lucide-react'

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

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Pinned/Priority Announcements */}
        {!loading && data.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-bold text-lg">Pengumuman Penting</h2>
            </div>
            <div className="space-y-4">
              {data.slice(0, 2).map((p) => (
                <ArticleCard
                  key={p.id}
                  image={p.foto_url}
                  category="Penting"
                  date={formatDate(p.created_at)}
                  title={p.judul}
                  excerpt={p.isi}
                  fileUrl={p.file_url}
                  linkUrl={p.link_url}
                  badgeColor="secondary"
                />
              ))}
            </div>
          </div>
        )}

        {/* All Announcements */}
        {!loading && data.length > 2 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title !mb-0">
                Semua <span>Pengumuman</span>
              </h2>
              <span className="text-sm text-ink-light flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {total} total
              </span>
            </div>
            <div className="space-y-4">
              {data.slice(2).map((p) => (
                <ArticleCard
                  key={p.id}
                  image={p.foto_url}
                  category="Pengumuman"
                  date={formatDate(p.created_at)}
                  title={p.judul}
                  excerpt={p.isi}
                  fileUrl={p.file_url}
                  linkUrl={p.link_url}
                  badgeColor="primary"
                />
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
