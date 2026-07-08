import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SkeletonBlock } from './Skeleton'
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function GaleriGrid({ kategori, title, emptyText }) {
  const [items, setItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('galeri')
      .select('*')
      .eq('aktif', true)
      .eq('kategori', kategori)
      .order('urutan', { ascending: true })
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [kategori])

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % items.length)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [activeIndex, items.length])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activeIndex])

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % items.length)
  }, [items.length])

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Page Header */}
      <div className="page-header rounded-b-2xl mb-8">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/galeri" className="hover:text-white">Galeri</Link>
            <span>/</span>
            <span className="text-white/60">{title}</span>
          </div>
          <h1>{title}</h1>
          <p>{items.length} foto dokumentasi</p>
        </div>
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3>Belum Ada Foto</h3>
          <p>{emptyText || 'Galeri sedang dalam pengembangan.'}</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="aspect-square rounded-xl" />
        ))}
        {!loading && items.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setActiveIndex(i)}
            className="block aspect-square overflow-hidden rounded-xl border border-ink/5 shadow-sm group relative"
          >
            <img
              src={g.foto_url}
              alt={g.judul}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div className="text-left">
                <p className="text-white text-sm font-medium line-clamp-1">{g.judul}</p>
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <ZoomIn className="w-3 h-3" />
                  Lihat
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setActiveIndex(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark/95 backdrop-blur-sm" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
            {activeIndex + 1} / {items.length}
          </div>

          {/* Main Image Container */}
          <div
            className="relative max-w-5xl w-full mx-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute -left-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative max-h-[75vh]">
              <img
                src={items[activeIndex].foto_url}
                alt={items[activeIndex].judul}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                <p className="font-display font-bold text-white text-lg">{items[activeIndex].judul}</p>
                {items[activeIndex].keterangan && (
                  <p className="text-white/70 text-sm mt-1">{items[activeIndex].keterangan}</p>
                )}
              </div>
            </div>

            {/* Next Button */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute -right-14 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full px-4 overflow-x-auto max-w-[90vw]">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex(i)
                  }}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? 'border-secondary scale-110'
                      : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
