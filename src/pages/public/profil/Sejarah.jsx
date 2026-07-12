import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { BookOpen, Building, Calendar } from 'lucide-react'
import { stripHtml } from '../../../lib/richText'

// Ambil ID video dari berbagai format URL YouTube (watch?v=, youtu.be/, shorts/, embed/)
function getYoutubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function Sejarah() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah')
      .select('sejarah, foto_sekolah_url, nama_sekolah, moto, sejarah_youtube_url, jenis_institusi, tahun_berdiri, jenjang_pendidikan')
      .eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  // Pecah sejarah (HTML) jadi item timeline berdasarkan paragraf teratas
  const parseHistory = (html) => {
    if (!html) return []
    const container = document.createElement('div')
    container.innerHTML = html
    const blocks = Array.from(container.children).filter((el) => el.textContent.trim())
    if (blocks.length <= 1) return []
    return blocks.map((el, i) => ({
      id: i,
      html: el.outerHTML,
      year: el.textContent.match(/\d{4}/)?.[0] || null,
    }))
  }

  const historyItems = parseHistory(p?.sejarah)
  const embedUrl = getYoutubeEmbedUrl(p?.sejarah_youtube_url)

  return (
    <div>
      {/* Page Header */}
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/profil/sejarah" className="hover:text-white">Tentang Kami</Link>
            <span>/</span>
            <span className="text-white/60">Sejarah</span>
          </div>
          <h1>Sejarah Sekolah</h1>
          <p>{p?.nama_sekolah || 'SMP Negeri 3 Besuki'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* School Photo */}
        {p?.foto_sekolah_url && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={p.foto_sekolah_url}
              alt="Foto sekolah"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="card p-5 text-center">
            <Building className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-display font-bold text-sm">Institusi</h3>
            <p className="text-xs text-ink-light">{p?.jenis_institusi || 'SMP Negeri'}</p>
          </div>
          <div className="card p-5 text-center">
            <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-display font-bold text-sm">Didirikan</h3>
            <p className="text-xs text-ink-light">{p?.tahun_berdiri || 'Lama beroperasi'}</p>
          </div>
          <div className="card p-5 text-center">
            <BookOpen className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-display font-bold text-sm">Pendidikan</h3>
            <p className="text-xs text-ink-light">{p?.jenjang_pendidikan || 'Jenjang SMP'}</p>
          </div>
        </div>

        {/* Video Sejarah (YouTube) */}
        {embedUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video">
            <iframe
              src={embedUrl}
              title="Video Sejarah Sekolah"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Timeline or Rich Content */}
        {historyItems.length > 1 ? (
          <div className="timeline">
            {historyItems.map((item) => (
              <div key={item.id} className="timeline-item">
                {item.year && <p className="timeline-year">{item.year}</p>}
                <div className="rich-content text-ink" dangerouslySetInnerHTML={{ __html: item.html }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8">
            {p?.sejarah ? (
              <div className="rich-content text-ink" dangerouslySetInnerHTML={{ __html: p.sejarah }} />
            ) : (
              <p className="text-ink leading-relaxed">Sejarah sekolah belum diisi.</p>
            )}
          </div>
        )}

        {/* Decorative Quote / Moto */}
        <div className="mt-12">
          <div className="quote-box">
            <p className="text-lg font-medium text-ink">
              "{stripHtml(p?.moto) || 'Mendidik dengan hati, berprestasi dengan karakter.'}"
            </p>
            <p className="text-sm text-ink-light mt-2">— Moto Sekolah</p>
          </div>
        </div>
      </div>
    </div>
  )
}
