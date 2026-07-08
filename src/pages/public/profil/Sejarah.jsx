import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { BookOpen, Building, Calendar } from 'lucide-react'

export default function Sejarah() {
  const [p, setP] = useState(null)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('sejarah, foto_sekolah_url, nama_sekolah').eq('id', 1).single()
      .then(({ data }) => setP(data))
  }, [])

  // Parse sejarah into timeline items (based on year detection)
  const parseHistory = (text) => {
    if (!text) return []
    const paragraphs = text.split('\n\n').filter(Boolean)
    return paragraphs.map((para, i) => ({
      id: i,
      content: para.trim(),
      // Try to extract year from first sentence
      year: para.match(/\d{4}/)?.[0] || null,
    }))
  }

  const historyItems = parseHistory(p?.sejarah)

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
            <p className="text-xs text-ink-light">SMP Negeri</p>
          </div>
          <div className="card p-5 text-center">
            <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-display font-bold text-sm">Didirikan</h3>
            <p className="text-xs text-ink-light">Lama beroperasi</p>
          </div>
          <div className="card p-5 text-center">
            <BookOpen className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="font-display font-bold text-sm">Pendidikan</h3>
            <p className="text-xs text-ink-light">Jenjang SMP</p>
          </div>
        </div>

        {/* Timeline or Paragraph */}
        {historyItems.length > 1 ? (
          <div className="timeline">
            {historyItems.map((item) => (
              <div key={item.id} className="timeline-item">
                {item.year && <p className="timeline-year">{item.year}</p>}
                <p className="text-ink leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8">
            <p className="text-ink leading-relaxed whitespace-pre-line">
              {p?.sejarah || 'Sejarah sekolah belum diisi.'}
            </p>
          </div>
        )}

        {/* Decorative Quote */}
        <div className="mt-12">
          <div className="quote-box">
            <p className="text-lg font-medium text-ink">
              "Mendidik dengan hati, berprestasi dengan karakter."
            </p>
            <p className="text-sm text-ink-light mt-2">— Moto Sekolah</p>
          </div>
        </div>
      </div>
    </div>
  )
}
