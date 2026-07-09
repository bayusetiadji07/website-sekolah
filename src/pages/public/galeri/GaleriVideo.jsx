import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import VideoGallery from '../../../components/VideoGallery'
import { Video, Play, Loader2 } from 'lucide-react'

export default function GaleriVideo() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('galeri_video')
      .select('*')
      .eq('aktif', true)
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVideos(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/galeri" className="hover:text-white">Galeri</Link>
            <span>/</span>
            <span className="text-white/60">Video</span>
          </div>
          <h1>Galeri Video</h1>
          <p>Kumpulan video kegiatan dan dokumentasi SMP Negeri 3 Besuki</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Play className="w-5 h-5 text-red-600 fill-red-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink">Video Kegiatan</h2>
            <p className="text-sm text-ink-light">
              {loading ? 'Memuat...' : `${videos.length} video`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Video Grid */}
        {!loading && videos.length > 0 && (
          <VideoGallery videos={videos} />
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Video className="w-8 h-8" />
            </div>
            <h3>Belum Ada Video</h3>
            <p>Video kegiatan akan ditampilkan di sini.</p>
          </div>
        )}

        {/* Back to Gallery */}
        <div className="mt-8 pt-6 border-t border-ink/10">
          <Link
            to="/galeri"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            ← Kembali ke Galeri Foto
          </Link>
        </div>
      </div>
    </div>
  )
}
