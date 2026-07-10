import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, User, Download, ExternalLink } from 'lucide-react'

/**
 * Card untuk berita, pengumuman, dll.
 * Props:
 * - image: URL gambar (opsional)
 * - category: kategori/label (opsional)
 * - date: tanggal
 * - title: judul
 * - excerpt: cuplikan isi
 * - author: penulis (opsional)
 * - to: link tujuan (jika ada halaman detail)
 * - fileUrl: link unduh file (opsional)
 * - linkUrl: link eksternal (opsional)
 * - badgeColor: 'primary' | 'secondary' | 'accent' (default: 'primary')
 */
export default function ArticleCard({
  image,
  category,
  date,
  title,
  excerpt,
  author,
  to,
  fileUrl,
  linkUrl,
  badgeColor = 'primary',
  className = '',
}) {
  // Tentukan link untuk "Baca Selengkapnya"
  const readMoreLink = to || linkUrl || null

  const content = (
    <>
      {/* Image - rasio tetap 16:9 agar tinggi kartu seragam */}
      {image && (
        <div className="card-image-wrapper aspect-video w-full">
          <img src={image} alt={title} className="card-image w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {category && (
            <span className={`badge badge-${badgeColor}`}>{category}</span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-xs text-ink-light">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
          )}
          {author && (
            <span className="flex items-center gap-1 text-xs text-ink-light">
              <User className="w-3.5 h-3.5" />
              {author}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-ink leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-ink-light leading-relaxed line-clamp-3 mb-3">
            {excerpt}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {/* Seluruh card sudah jadi link (lihat cardWrapper), jadi ini cuma label visual, bukan <a> lagi supaya tidak nested-anchor */}
          {readMoreLink && (
            <span className="read-more">
              Baca Selengkapnya
              {linkUrl ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </span>
          )}

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-3.5 h-3.5" />
              Unduh
            </a>
          )}
        </div>
      </div>
    </>
  )

  // Tentukan link untuk card wrapper dan "Baca Selengkapnya"
  const cardWrapper = readMoreLink ? (
    <a href={linkUrl || to} target={linkUrl ? "_blank" : undefined} rel={linkUrl ? "noreferrer" : undefined} className={`card group h-full flex flex-col ${className}`}>
      {content}
    </a>
  ) : (
    <article className={`card h-full flex flex-col ${className}`}>
      {content}
    </article>
  )

  return cardWrapper
}

/**
 * Card horizontal untuk featured content
 */
export function ArticleCardHorizontal({
  image,
  category,
  date,
  title,
  excerpt,
  to,
  badgeColor = 'primary',
}) {
  return (
    <Link to={to} className="card group flex flex-col sm:flex-row">
      {image && (
        <div className="sm:w-48 lg:w-56 shrink-0">
          <div className="card-image-wrapper aspect-video sm:aspect-square">
            <img src={image} alt={title} className="card-image" />
          </div>
        </div>
      )}
      <div className="p-5 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {category && <span className={`badge badge-${badgeColor}`}>{category}</span>}
          {date && (
            <span className="flex items-center gap-1 text-xs text-ink-light">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-lg text-ink leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-ink-light leading-relaxed line-clamp-2">{excerpt}</p>
        )}
        <span className="read-more mt-3">
          Baca Selengkapnya
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
