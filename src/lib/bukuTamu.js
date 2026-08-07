/**
 * Helper bersama untuk modul Buku Tamu Digital.
 *
 * Data tamu disimpan di tabel `bt_visitors`. Tamu mengisi sendiri lewat HP
 * (insert bebas), sedangkan pembacaan, check-out, dan penghapusan dibatasi
 * RLS untuk akun ber-role admin/tu.
 */

export const KATEGORI_KUNJUNGAN = [
  'Tamu Resmi/Dinas',
  'Orang Tua/Wali Murid',
  'Vendor/Rekanan',
  'Lainnya',
]

/* ---------- Format tanggal & jam (selalu WIB) ---------- */

export function fmtJam(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function fmtTanggalJam(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  })
}

/** Tanggal (YYYY-MM-DD) menurut zona WIB, bukan UTC bawaan browser. */
export function wibDateStr(tanggal) {
  const tz = new Date(new Date(tanggal).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  const y = tz.getFullYear()
  const m = String(tz.getMonth() + 1).padStart(2, '0')
  const d = String(tz.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function hariIniStr() {
  return wibDateStr(new Date())
}

/* ---------- Kompresi foto adaptif ----------
   Foto dari kamera HP bisa beberapa MB. Karena disimpan sebagai base64 di
   database, ukurannya diciutkan bertahap (lebar & kualitas diturunkan) sampai
   di bawah target, supaya beban penyimpanan tetap kecil. */

const TARGET_BYTES = 160 * 1024
const MIN_LEBAR = 320
const MIN_KUALITAS = 0.35

function bacaFileSebagaiDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function muatGambar(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function gambarKeJpeg(img, lebarMax, kualitas) {
  const skala = Math.min(1, lebarMax / img.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * skala))
  canvas.height = Math.max(1, Math.round(img.height * skala))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', kualitas)
}

export function perkiraanUkuranBytes(dataUrl) {
  const i = dataUrl.indexOf(',')
  const base64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl
  return Math.round((base64.length * 3) / 4)
}

export async function kompresFoto(file) {
  const img = await muatGambar(await bacaFileSebagaiDataUrl(file))

  let lebar = 640
  let kualitas = 0.7
  let hasil = gambarKeJpeg(img, lebar, kualitas)

  let percobaan = 0
  while (
    perkiraanUkuranBytes(hasil) > TARGET_BYTES &&
    percobaan < 6 &&
    (lebar > MIN_LEBAR || kualitas > MIN_KUALITAS)
  ) {
    kualitas = Math.max(MIN_KUALITAS, +(kualitas - 0.12).toFixed(2))
    lebar = Math.max(MIN_LEBAR, Math.round(lebar * 0.85))
    hasil = gambarKeJpeg(img, lebar, kualitas)
    percobaan++
  }

  return {
    dataUrl: hasil,
    ukuranAsliBytes: file.size,
    ukuranAkhirBytes: perkiraanUkuranBytes(hasil),
  }
}

export function fmtUkuran(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

/* ---------- Export CSV ---------- */

export const KOLOM_TAMU = [
  { label: 'Nama', get: (t) => t.nama },
  { label: 'No HP', get: (t) => t.no_hp },
  { label: 'Instansi', get: (t) => t.instansi },
  { label: 'Kategori', get: (t) => t.kategori },
  { label: 'Tujuan', get: (t) => t.tujuan },
  { label: 'Bertemu Dengan', get: (t) => t.bertemu_dengan },
  { label: 'Check-in', get: (t) => fmtTanggalJam(t.check_in_time) },
  { label: 'Check-out', get: (t) => (t.check_out_time ? fmtTanggalJam(t.check_out_time) : '') },
]

export function unduhCsv(namaBerkas, rows, kolom = KOLOM_TAMU) {
  const head = kolom.map((k) => `"${k.label}"`).join(',')
  const body = rows
    .map((r) => kolom.map((k) => `"${String(k.get(r) ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  // BOM di depan supaya Excel membaca UTF-8 dengan benar
  const blob = new Blob([`﻿${head}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = namaBerkas
  a.click()
  URL.revokeObjectURL(a.href)
}
