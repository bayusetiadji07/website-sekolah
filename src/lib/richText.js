// Ubah HTML hasil rich text editor jadi teks polos (untuk cuplikan/excerpt di kartu).
export function stripHtml(html) {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim()
}

/**
 * Tandai paragraf isi pertama yang cukup panjang dengan class `has-dropcap`,
 * supaya CSS bisa memberinya huruf kapital besar. Paragraf pendek (mis. baris
 * salam) dilewati agar huruf besarnya tidak menggantung sendirian.
 *
 * Penandaan dilakukan pada string HTML-nya, BUKAN pada DOM setelah render:
 * React menulis ulang isi elemen dangerouslySetInnerHTML setiap kali commit,
 * sehingga class yang ditambahkan belakangan lewat ref/effect akan terhapus.
 */
export function markDropCap(html, minLen = 120) {
  if (!html) return html
  const div = document.createElement('div')
  div.innerHTML = html
  const para = [...div.querySelectorAll('p')].find(
    (n) => n.textContent.trim().length > minLen
  )
  if (!para) return html
  para.classList.add('has-dropcap')
  return div.innerHTML
}

// Cuplikan teks polos yang dipotong di batas kata, untuk penggoda di beranda.
export function excerpt(html, maxLen = 200) {
  const text = stripHtml(html)
  if (text.length <= maxLen) return text
  const cut = text.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
