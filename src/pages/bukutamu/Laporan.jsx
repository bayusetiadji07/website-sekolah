import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { bukuTamuLinks } from './links'
import { hariIniStr, wibDateStr, unduhCsv } from '../../lib/bukuTamu'
import { Download } from 'lucide-react'

export default function BukuTamuLaporan() {
  const [bulan, setBulan] = useState(hariIniStr().slice(0, 7))
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const jumlahHari = useMemo(() => {
    const [y, m] = bulan.split('-').map(Number)
    return new Date(y, m, 0).getDate()
  }, [bulan])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const akhir = String(jumlahHari).padStart(2, '0')
      const { data, error } = await supabase
        .from('bt_visitors')
        .select('*')
        .gte('check_in_time', `${bulan}-01T00:00:00+07:00`)
        .lte('check_in_time', `${bulan}-${akhir}T23:59:59+07:00`)
        .order('check_in_time')
      setLoading(false)
      if (error) { setMsg('Gagal memuat laporan bulanan.'); return }
      setMsg('')
      setItems(data || [])
    }
    load()
  }, [bulan, jumlahHari])

  const perHari = useMemo(() => {
    const acc = {}
    items.forEach((t) => {
      const d = wibDateStr(t.check_in_time)
      acc[d] = (acc[d] || 0) + 1
    })
    return acc
  }, [items])

  const perKategori = useMemo(() => {
    const acc = {}
    items.forEach((t) => { acc[t.kategori] = (acc[t.kategori] || 0) + 1 })
    return Object.entries(acc).sort((a, b) => b[1] - a[1])
  }, [items])

  const rataDurasi = useMemo(() => {
    const durasi = items
      .filter((t) => t.check_out_time)
      .map((t) => (new Date(t.check_out_time) - new Date(t.check_in_time)) / 60000)
    if (!durasi.length) return 0
    return Math.round(durasi.reduce((a, b) => a + b, 0) / durasi.length)
  }, [items])

  const tersibuk = useMemo(() => {
    const list = Object.entries(perHari).sort((a, b) => b[1] - a[1])
    return list.length ? list[0] : null
  }, [perHari])

  const maxKategori = Math.max(1, ...perKategori.map(([, v]) => v))
  const maxHari = Math.max(1, ...Object.values(perHari))

  const kartu = [
    { label: 'Total pengunjung', nilai: items.length },
    { label: 'Rata-rata durasi', nilai: `${rataDurasi} mnt` },
    { label: 'Hari tersibuk', nilai: tersibuk ? `${tersibuk[0].slice(-2)} (${tersibuk[1]})` : '-' },
    { label: 'Rata-rata / hari', nilai: (items.length / jumlahHari).toFixed(1) },
  ]

  return (
    <DashboardLayout links={bukuTamuLinks} title="Buku Tamu">
      <h1 className="font-display text-2xl font-bold mb-2">Laporan Bulanan</h1>
      <p className="text-sm text-ink/70 mb-6">Rekap kunjungan tamu sekolah per bulan.</p>

      <div className="flex flex-wrap gap-2 items-center mb-5">
        <input
          type="month"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={() => items.length && unduhCsv(`laporan-buku-tamu-${bulan}.csv`, items)}
          disabled={!items.length}
          className="text-sm px-3 py-2 rounded-lg border border-ink/15 inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
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
          <p className="text-sm text-ink/50">Belum ada data pada bulan ini.</p>
        )}
      </div>

      <div className="border border-ink/10 rounded-xl p-5">
        <h2 className="font-display font-bold text-base mb-3">Tren Pengunjung per Hari</h2>
        <div className="flex items-end gap-1 h-32 overflow-x-auto">
          {Array.from({ length: jumlahHari }, (_, i) => {
            const tgl = `${bulan}-${String(i + 1).padStart(2, '0')}`
            const v = perHari[tgl] || 0
            return (
              <div key={tgl} className="flex flex-col items-center gap-1 shrink-0" title={`${tgl}: ${v} tamu`}>
                <div
                  className="w-3 bg-primary/70 rounded-t"
                  style={{ height: `${Math.max(2, (v / maxHari) * 100)}px` }}
                />
                <span className="text-[9px] text-ink/50">{i + 1}</span>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
