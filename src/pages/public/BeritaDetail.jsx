import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SkeletonList } from '../../components/Skeleton'
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react'

export default function BeritaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    supabase
      .from('berita_kegiatan')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true)
        } else {
          setData(data)
        }
        setLoading(false)
      })
  }, [id])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-4xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/berita" className="hover:text-white">Berita & Kegiatan</Link>
            <span>/</span>
            <span className="text-white/60">Detail</span>
          </div>
          <h1>{loading ? 'Memuat...' : notFound ? 'Berita Tidak Ditemukan' : data?.judul}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        {loading && <SkeletonList count={1} />}

        {!loading && notFound && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Newspaper className="w-8 h-8" />
            </div>
            <h3>Berita Tidak Ditemukan</h3>
            <p>Berita yang Anda cari mungkin sudah dihapus atau belum dipublikasikan.</p>
            <button onClick={() => navigate('/berita')} className="btn btn-outline mt-4">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Berita
            </button>
          </div>
        )}

        {!loading && data && (
          <article className="bg-white rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
            {data.foto_url && (
              <div className="w-full bg-gray-100">
                <img
                  src={data.foto_url}
                  alt={data.judul}
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="badge badge-primary">Berita</span>
                <span className="flex items-center gap-1.5 text-sm text-ink-light">
                  <Calendar className="w-4 h-4" />
                  {formatDate(data.created_at)}
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-6 leading-tight">
                {data.judul}
              </h2>
              <div className="rich-content text-ink-light text-base" dangerouslySetInnerHTML={{ __html: data.isi }} />
              <div className="mt-8 pt-6 border-t border-ink/10">
                <Link to="/berita" className="read-more">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Semua Berita
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
