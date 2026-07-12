// Render HTML hasil RichTextEditor di halaman publik.
export default function RichText({ html, className = '', fallback = null }) {
  if (!html || !html.trim()) return fallback
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
