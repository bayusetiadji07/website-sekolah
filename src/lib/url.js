/**
 * Rapikan tautan yang diketik admin agar selalu jadi alamat mutlak.
 *
 * Tanpa awalan protokol, `<a href="contoh.com">` dianggap browser sebagai
 * alamat RELATIF terhadap halaman saat ini. Akibatnya pengunjung diarahkan ke
 * rute yang tidak ada di dalam website ini sendiri dan hanya melihat layar
 * kosong. Fungsi ini menambahkan https:// bila protokolnya belum ditulis.
 *
 * Bentuk yang memang bukan alamat web biasa (mailto:, tel:, #anchor, dan
 * jalur internal yang diawali /) dibiarkan apa adanya.
 */
export function normalizeUrl(url) {
  if (!url) return url
  const clean = String(url).trim()
  if (!clean) return clean

  // Sudah punya skema (https:, mailto:, tel:, dst.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(clean)) return clean

  // Bentuk //contoh.com — lengkapi protokolnya saja.
  // Harus diperiksa sebelum jalur internal, karena '//' juga diawali '/'.
  if (clean.startsWith('//')) return `https:${clean}`

  // Jalur internal atau anchor di halaman yang sama
  if (clean.startsWith('/') || clean.startsWith('#')) return clean

  return `https://${clean}`
}
