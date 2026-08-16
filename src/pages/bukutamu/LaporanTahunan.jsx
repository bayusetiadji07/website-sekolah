import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { bukuTamuLinks } from './links'
import { hariIniStr, wibDateStr, unduhCsv, cetakPdfLaporan, NAMA_BULAN } from '../../lib/bukuTamu'
import { Download, FileDown, Inbox } from 'lucide-react'

export default function BukuTamuLaporanTahunan() {
  const { profile } = useAuth()
  const [tahun, setTahun] = useState(Number(hariIniStr().slice(0, 4)))
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [cetakBusy, setCetakBusy] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Foto tidak diambil di sini (rekap tahunan bersifat agregat, bukan tinjau
      // per-tamu) supaya payload tetap ringan — beda dengan Laporan Bulanan.
      const { data, error } = await supabase
        .from('bt_visitors')
        .select('id, nama, instansi, kategori, tujuan, bertemu_dengan, check_in_time, check_out_time')
        .gte('check_in_time', `${tahun}-01-01T00:00:00+07:00`)
        .lte('check_in_time', `${tahun}-12-31T23:59:59+07:00`)
        .order('check_in_time')
      setLoading(false)
      if (error) { setMsg('Gagal memuat laporan tahunan.'); return }
      setMsg('')
      setItems(data || [])
    }
    load()
  }, [tahun])

  const perBulan = useMemo(() => {
    const acc = Array.from({ length: 12 }, () => [])
    items.forEach((t) => {
      const idx = Number(wibDateStr(t.check_in_time).slice(5, 7)) - 1
      acc[idx].push(t)
    })
    return acc
  }, [items])

  const rekapBulan = useMemo(() => perBulan.map((arr, i) => {
    const durasi = arr
      .filter((t) => t.check_out_time)
      .map((t) => (new Date(t.check_out_time) - new Date(t.check_in_time)) / 60000)
    const rataDurasi = durasi.length ? Math.round(durasi.reduce((a, b) => a + b, 0) / durasi.length) : 0
    const perKat = {}
    arr.forEach((t) => { perKat[t.kategori] = (perKat[t.kategori] || 0) + 1 })
    const katTerbanyak = Object.entries(perKat).sort((a, b) => b[1] - a[1])[0]
    return {
      bulanIdx: i,
      bulanNilai: `${tahun}-${String(i + 1).padStart(2, '0')}`,
      total: arr.length,
      rataDurasi,
      katTerbanyak: katTerbanyak ? `${katTerbanyak[0]} (${katTerbanyak[1]})` : '-',
    }
  }), [perBulan, tahun])

  const rataDurasiTahun = useMemo(() => {
    const durasi = items
      .filter((t) => t.check_out_time)
      .map((t) => (new Date(t.check_out_time) - new Date(t.check_in_time)) / 60000)
    if (!durasi.length) return 0
    return Math.round(durasi.reduce((a, b) => a + b, 0) / durasi.length)
  }, [items])

  const bulanTersibukIdx = useMemo(
    () => perBulan.reduce((maxIdx, arr, i) => (arr.length > perBulan[maxIdx].length ? i : maxIdx), 0),
    [perBulan],
  )

  const perKategori = useMemo(() => {
    const acc = {}
    items.forEach((t) => { acc[t.kategori] = (acc[t.kategori] || 0) + 1 })
    return Object.entries(acc).sort((a, b) => b[1] - a[1])
  }, [items])

  const maxKategori = Math.max(1, ...perKategori.map(([, v]) => v))
  const maxBulan = Math.max(1, ...perBulan.map((a) => a.length))

  const kartu = [
    { label: 'Total pengunjung', nilai: items.length },
    { label: 'Rata-rata durasi', nilai: `${rataDurasiTahun} mnt` },
    { label: 'Bulan tersibuk', nilai: items.length ? `${NAMA_BULAN[bulanTersibukIdx]} (${perBulan[bulanTersibukIdx].length})` : '-' },
    { label: 'Rata-rata / bulan', nilai: (items.length / 12).toFixed(1) },
  ]

  async function cetakPdf() {
    if (!items.length) { setMsg('Tidak ada data tahun ini untuk dicetak.'); return }
    setCetakBusy(true)
    try {
      await cetakPdfLaporan({
        subjudul: 'Laporan Tahunan',
        periode: `Tahun ${tahun}`,
        ringkasan: [
          { label: 'Total Pengunjung', value: items.length },
          { label: 'Rata-rata Durasi', value: `${rataDurasiTahun} mnt` },
          { label: 'Bulan Tersibuk', value: items.length ? `${NAMA_BULAN[bulanTersibukIdx]} (${perBulan[bulanTersibukIdx].length})` : '-' },
          { label: 'Rata-rata / Bulan', value: (items.length / 12).toFixed(1) },
        ],
        kategoriRows: perKategori,
        tabelHead: ['Bulan', 'Total Tamu', 'Rata-rata Durasi (mnt)', 'Kategori Terbanyak'],
        tabelBody: rekapBulan.map((r) => [NAMA_BULAN[r.bulanIdx], r.total, r.rataDurasi, r.katTerbanyak]),
        namaFile: `laporan-tahunan-buku-tamu-${tahun}.pdf`,
        dicetakOleh: profile?.nama || profile?.role,
      })
    } catch (e) {
      console.error(e)
      setMsg('Gagal membuat PDF. Coba lagi.')
    }
    setCetakBusy(false)
  }

  const inputClass = 'border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary'

  return (
    <DashboardLayout links={bukuTamuLinks} title="Buku Tamu">
      <h1 className="font-display text-2xl font-bold mb-2">Laporan Tahunan</h1>
      <p className="text-sm text-ink/70 mb-6">Rekap kunjungan tamu sekolah per tahun, dipecah per bulan.</p>

      <div className="flex flex-wrap gap-2 items-center justify-between mb-5">
        <input
          type="number"
          step="1"
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value) || tahun)}
          className={`${inputClass} w-28`}
        />
        <div className="flex gap-2">
          <button
            onClick={() => items.length && unduhCsv(`laporan-tahunan-${tahun}.csv`, items)}
            disabled={!items.length}
            className="text-sm px-3 py-2 rounded-lg border border-ink/15 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={cetakPdf}
            disabled={!items.length || cetakBusy}
            className="btn btn-primary text-sm disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" /> {cetakBusy ? 'Menyiapkan PDF...' : 'Cetak Massal (PDF)'}
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-rust bg-rust/10 border border-rust/20 rounded-lg px-3 py-2 mb-4">{msg}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {kartu.map((k) => (
          <div key={k.label} className="border border-ink/10 rounded-xl p-4">
            <p className="text-xs text-ink/60">{k.label}</p>
            <p className="text-xl font-bold mt-0.5">{loading ? '—' : k.nilai}</p>
          </div>
        ))}
      </div>

      <div className="border border-ink/10 rounded-xl p-5 mb-5">
        <h2 className="font-display font-bold text-base mb-3">Kategori Kunjungan</h2>
        {perKategori.length ? (
          <div className="space-y-3">
            {perKategori.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(v / maxKategori) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50">Belum ada data pada tahun ini.</p>
        )}
      </div>

      <div className="border border-ink/10 rounded-xl p-5 mb-5">
        <h2 className="font-display font-bold text-base mb-3">Tren Pengunjung per Bulan</h2>
        <div className="flex items-end gap-2 h-32">
          {perBulan.map((arr, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1" title={`${NAMA_BULAN[i]}: ${arr.length} tamu`}>
              <div
                className="w-full max-w-8 bg-primary/70 rounded-t mx-auto"
                style={{ height: `${Math.max(2, (arr.length / maxBulan) * 100)}px` }}
              />
              <span className="text-[9px] text-ink/50">{NAMA_BULAN[i].slice(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-display font-bold text-base mb-3">Rekap per Bulan</h2>
      <div className="border border-ink/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-ink/70 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2.5 font-semibold">Bulan</th>
                <th className="text-left px-3 py-2.5 font-semibold">Total Tamu</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell">Rata-rata Durasi</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden md:table-cell">Kategori Terbanyak</th>
                <th className="text-right px-3 py-2.5 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-t border-ink/5">
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-3 py-3"><div className="h-3 bg-ink/10 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                : rekapBulan.map((r) => (
                    <tr key={r.bulanNilai} className="border-t border-ink/5">
                      <td className="px-3 py-2.5 font-medium">{NAMA_BULAN[r.bulanIdx]}</td>
                      <td className="px-3 py-2.5 text-ink/70">{r.total}</td>
                      <td className="px-3 py-2.5 text-ink/70 hidden sm:table-cell">{r.rataDurasi} mnt</td>
                      <td className="px-3 py-2.5 text-ink/70 hidden md:table-cell">{r.katTerbanyak}</td>
                      <td className="px-3 py-2.5 text-right">
                        {r.total > 0 ? (
                          <Link
                            to={`/buku-tamu/laporan?bulan=${r.bulanNilai}`}
                            className="text-primary text-xs font-semibold hover:underline"
                          >
                            Lihat Bulan →
                          </Link>
                        ) : (
                          <span className="text-ink/30 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && items.length === 0 && (
          <div className="text-center py-10">
            <Inbox className="w-8 h-8 mx-auto text-ink/25" />
            <p className="text-sm text-ink/60 mt-2">Belum ada tamu untuk tahun ini.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
