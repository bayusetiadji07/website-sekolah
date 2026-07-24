import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export const JENIS_SURAT = [
  { value: 'aktif', label: 'Surat Keterangan Aktif' },
  { value: 'lulus_sementara', label: 'Surat Keterangan Lulus Sementara' },
  { value: 'pengantar', label: 'Surat Pengantar' },
  { value: 'mutasi_masuk', label: 'Surat Keterangan Mutasi Masuk' },
  { value: 'mutasi_keluar', label: 'Surat Keterangan Mutasi Keluar' },
  { value: 'izin_dispensasi', label: 'Surat Izin / Dispensasi' },
  { value: 'koreksi_ijazah', label: 'Surat Keterangan Kesalahan Penulisan Ijazah' },
]

export function jenisSuratLabel(value) {
  return JENIS_SURAT.find((j) => j.value === value)?.label || value
}

const STATUS_META = {
  diajukan: { label: 'Diajukan', className: 'bg-sky-100 text-sky-700' },
  diproses: { label: 'Diproses', className: 'bg-amber-100 text-amber-700' },
  selesai: { label: 'Selesai', className: 'bg-emerald-100 text-emerald-700' },
  ditolak: { label: 'Ditolak', className: 'bg-red-100 text-red-700' },
}

export function statusMeta(status) {
  return STATUS_META[status] || { label: status || '-', className: 'bg-ink/10 text-ink/70' }
}

function formatTanggal(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Tahun ajaran berjalan: Juli s/d Juni (mis. Agustus 2026 -> 2026/2027, Maret 2026 -> 2025/2026)
function tahunAjaranBerjalan() {
  const now = new Date()
  const year = now.getFullYear()
  return now.getMonth() >= 6 ? `${year}/${year + 1}` : `${year - 1}/${year}`
}

function drawKopSurat(doc, pengaturanSekolah) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 25
  let y = 18

  const namaSekolah = pengaturanSekolah?.nama_sekolah || 'SMP Negeri 3 Besuki'
  const alamat = pengaturanSekolah?.alamat || ''
  const email = pengaturanSekolah?.email || ''

  if (pengaturanSekolah?.logo_url) {
    try {
      doc.addImage(pengaturanSekolah.logo_url, 'PNG', marginX, y - 8, 20, 20)
    } catch {
      // logo gagal dimuat (mis. CORS) - lanjut tanpa logo
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('PEMERINTAH KABUPATEN SITUBONDO', pageWidth / 2, y, { align: 'center' })
  y += 6
  doc.setFontSize(14)
  doc.text(namaSekolah.toUpperCase(), pageWidth / 2, y, { align: 'center' })
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const kontak = [alamat, email].filter(Boolean)
  kontak.forEach((line) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 4.5
  })

  y += 2
  doc.setLineWidth(1)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 0.8
  doc.setLineWidth(0.3)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 10

  return y
}

function drawTandaTangan(doc, y, pengaturanSekolah) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 25
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Besuki, ${formatTanggal(new Date())}`, pageWidth - marginX, y, { align: 'right' })
  y += 6
  doc.text('Kepala Sekolah', pageWidth - marginX, y, { align: 'right' })
  const namaY = y + 25

  // Stempel (di bawah/kiri blok TTD) + tanda tangan (menimpa sebagian stempel) - ditaruh sebelum
  // teks nama supaya nama tetap kebaca di atas gambar.
  if (pengaturanSekolah?.stempel_sekolah_url) {
    try {
      doc.addImage(pengaturanSekolah.stempel_sekolah_url, 'PNG', pageWidth - marginX - 65, y + 2, 32, 32)
    } catch {
      // gambar gagal dimuat - lanjut tanpa stempel
    }
  }
  if (pengaturanSekolah?.ttd_kepala_sekolah_url) {
    try {
      doc.addImage(pengaturanSekolah.ttd_kepala_sekolah_url, 'PNG', pageWidth - marginX - 55, y + 6, 40, 20)
    } catch {
      // gambar gagal dimuat - lanjut tanpa TTD
    }
  }

  y = namaY
  doc.setFont('helvetica', 'bold')
  doc.text(pengaturanSekolah?.nama_kepala_sekolah || '(...........................)', pageWidth - marginX, y, { align: 'right', underline: true })
  y += 5
  doc.setFont('helvetica', 'normal')
  if (pengaturanSekolah?.nip_kepala_sekolah) {
    doc.text(`NIP. ${pengaturanSekolah.nip_kepala_sekolah}`, pageWidth - marginX, y, { align: 'right' })
  }
}

async function drawQrVerifikasi(doc, pengajuan) {
  const marginX = 25
  const pageHeight = doc.internal.pageSize.getHeight()
  const verifyUrl = `${window.location.origin}/sipas/status/${pengajuan.no_tiket}`
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 })
    const qrY = pageHeight - 45
    doc.addImage(qrDataUrl, 'PNG', marginX, qrY, 25, 25)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text('Pindai untuk verifikasi keaslian surat', marginX, qrY + 29)
    doc.text(pengajuan.no_tiket, marginX, qrY + 33)
  } catch {
    // gagal generate QR - surat tetap valid tanpa QR
  }
}

export async function generateSuratPdf(pengajuan, pengaturanSekolah, formatTemplate) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 25
  const namaSekolah = pengaturanSekolah?.nama_sekolah || 'SMP Negeri 3 Besuki'
  let y = drawKopSurat(doc, pengaturanSekolah)

  const judul = pengajuan.jenis_surat === 'aktif' ? 'SURAT KETERANGAN' : jenisSuratLabel(pengajuan.jenis_surat).toUpperCase()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(judul, pageWidth / 2, y, { align: 'center' })
  const titleWidth = doc.getTextWidth(judul)
  doc.setLineWidth(0.3)
  doc.line(pageWidth / 2 - titleWidth / 2, y + 1, pageWidth / 2 + titleWidth / 2, y + 1)
  y += 5
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10)
  doc.text(`No : ${pengajuan.nomor_surat || '-'}`, pageWidth / 2, y, { align: 'center' })
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)

  if (pengajuan.jenis_surat === 'aktif') {
    const pembuka = `Yang bertanda tangan di bawah ini kepala ${namaSekolah} Kabupaten Situbondo menerangkan dengan sebenarnya bahwa :`
    const pembukaLines = doc.splitTextToSize(pembuka, pageWidth - marginX * 2)
    doc.text(pembukaLines, marginX, y, { lineHeightFactor: 1.6 })
    y += pembukaLines.length * 6 + 6

    const dataRows = [
      ['Nama', pengajuan.nama_siswa || '-'],
      ['Tempat /Tgl. Lahir', pengajuan.tempat_tanggal_lahir || '-'],
      ['NIS', pengajuan.nis || '-'],
      ['NISN', pengajuan.nisn || '-'],
    ]
    const labelX = marginX + 5
    const colonX = marginX + 45
    dataRows.forEach(([label, value]) => {
      doc.text(label, labelX, y)
      doc.text(`: ${value}`, colonX, y)
      y += 6
    })
    y += 6

    const penutup = `adalah benar - benar pada saat ini tercatat sebagai siswa Kelas ${pengajuan.kelas || '-'} ${namaSekolah} Tahun Ajaran ${tahunAjaranBerjalan()}.`
    const penutupLines = doc.splitTextToSize(penutup, pageWidth - marginX * 2)
    doc.text(penutupLines, marginX, y, { lineHeightFactor: 1.6 })
    y += penutupLines.length * 6 + 4

    const demikian = 'Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.'
    const demikianLines = doc.splitTextToSize(demikian, pageWidth - marginX * 2)
    doc.text(demikianLines, marginX, y, { lineHeightFactor: 1.6 })
    y += demikianLines.length * 6 + 14
  } else {
    const isi = (formatTemplate || '')
      .replaceAll('{{nama}}', pengajuan.nama_siswa || '-')
      .replaceAll('{{nisn}}', pengajuan.nisn || '-')
      .replaceAll('{{kelas}}', pengajuan.kelas || '-')
      .replaceAll('{{keperluan}}', pengajuan.keperluan || '-')
      .replaceAll('{{tanggal}}', formatTanggal(pengajuan.tanggal_ajuan))

    const lines = doc.splitTextToSize(isi, pageWidth - marginX * 2)
    doc.text(lines, marginX, y, { lineHeightFactor: 1.6 })
    y += lines.length * 6 + 14
  }

  drawTandaTangan(doc, y, pengaturanSekolah)
  await drawQrVerifikasi(doc, pengajuan)

  return doc.output('blob')
}
