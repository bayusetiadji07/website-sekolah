// Ubah HTML hasil rich text editor jadi teks polos (untuk cuplikan/excerpt di kartu).
export function stripHtml(html) {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim()
}
