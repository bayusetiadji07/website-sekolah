import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'
import ArticleCard from '../../components/ArticleCard'
import { Newspaper, ArrowRight, Clock } from 'lucide-react'
import { stripHtml } from '../../lib/richText'

export default function Berita() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    supabase
      .from('berita_kegiatan')
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
            <span className="text-white/60">Berita & Kegiatan</span>
          </div>
          <h1>Berita & Kegiatan</h1>
          <p>{total} artikel published</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Newspaper className="w-8 h-8" />
            </div>
            <h3>Belum Ada Berita</h3>
            <p>Berita dan kegiatan akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && <SkeletonList count={6} cols="sm:grid-cols-2 lg:grid-cols-3" />}

        {/* Featured Article */}
        {!loading && data.length > 0 && (
          <div className="mb-10">
            <ArticleCard
              image={data[0]?.foto_url}
              category="Featured"
              date={formatDate(data[0]?.created_at)}
              title={data[0]?.judul}
              excerpt={stripHtml(data[0]?.isi).substring(0, 200)}
              to={`/berita/${data[0]?.id}`}
              badgeColor="secondary"
              className="max-w-4xl"
            />
          </div>
        )}

        {/* Article Grid */}
        {!loading && data.length > 1 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title !mb-0">
                Semua <span>Berita</span>
              </h2>
              <span className="text-sm text-ink-light flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Diurutkan dari terbaru
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.slice(1).map((b) => (
                <ArticleCard
                  key={b.id}
                  image={b.foto_url}
                  category="Berita"
                  date={formatDate(b.created_at)}
                  title={b.judul}
                  excerpt={stripHtml(b.isi)}
                  to={`/berita/${b.id}`}
                  badgeColor="primary"
                />
              ))}
            </div>
          </>
        )}

        {/* Load More placeholder */}
        {total > 9 && (
          <div className="text-center mt-10">
            <button className="btn btn-outline">
              Lihat Lebih Banyak
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
