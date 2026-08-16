import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { bukuTamuLinks } from './links'
import {
  hariIniStr,
  wibDateStr,
  unduhCsv,
  fmtJam,
  fmtTanggalJam,
  cetakPdfLaporan,
  NAMA_BULAN,
} from '../../lib/bukuTamu'
import { Download, FileDown, Inbox, LogOut, X } from 'lucide-react'

export default function BukuTamuLaporan() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  // ?bulan=YYYY-MM dipakai saat dilempar dari rekap Laporan Tahunan
  const [bulan, setBulan] = useState(searchParams.get('bulan') || hariIniStr().slice(0, 7))
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [cari, setCari] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [cetakBusy, setCetakBusy] = useState(false)

  const jumlahHari = useMemo(() => {
    const [y, m] = bulan.split('-').map(Number)
    return new Date(y, m, 0).getDate()
  }, [bulan])

  const load = useCallback(async () => {
    setLoading(true)
    const akhir = String(jumlahHari).padStart(2, '0')
    const { data, error } = await supabase
      .from('bt_visitors')
      .select('*')
      .gte('check_in_time', `${bulan}-01T00:00:00+07:00`)
      .lte('check_in_time', `${bulan}-${akhir}T23:59:59+07:00`)
      .order('check_in_time', { ascending: false })
    setLoading(false)
    if (error) { setMsg('Gagal memuat laporan bulanan.'); return }
    setMsg('')
    setItems(data || [])
  }, [bulan, jumlahHari])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = cari.trim().toLowerCase()
    if (!q) return items
    return items.filter((t) => `${t.nama} ${t.instansi} ${t.tujuan}`.toLowerCase().includes(q))
  }, [items, cari])

  const selected = items.find((t) => t.id === selectedId) || null

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

  async function checkOut(item) {
    setBusy(true)
    const { error } = await supabase
      .from('bt_visitors')
      .update({ check_out_time: new Date().toISOString() })
      .eq('id', item.id)
    setBusy(false)
    if (error) { setMsg('Gagal mencatat check-out.'); return }
    setSelectedId(null)
    load()
  }

  async function hapus(item) {
    if (!confirm(`Hapus data kunjungan ${item.nama}? Tindakan ini tidak bisa dibatalkan.`)) return
    setBusy(true)
    const { error } = await supabase.from('bt_visitors').delete().eq('id', item.id)
    setBusy(false)
    if (error) { setMsg('Gagal menghapus data.'); return }
    setSelectedId(null)
    load()
  }

  async function cetakPdf() {
    if (!items.length) { setMsg('Tidak ada data bulan ini untuk dicetak.'); return }
    setCetakBusy(true)
    try {
      const [y, m] = bulan.split('-').map(Number)
      await cetakPdfLaporan({
        subjudul: 'Laporan Bulanan',
        periode: `${NAMA_BULAN[m - 1]} ${y}`,
        ringkasan: [
          { label: 'Total Pengunjung', value: items.length },
          { label: 'Rata-rata Durasi', value: `${rataDurasi} mnt` },
          { label: 'Hari Tersibuk', value: tersibuk ? `${tersibuk[0].slice(-2)} (${tersibuk[1]})` : '-' },
          { label: 'Rata-rata / Hari', value: (items.length / jumlahHari).toFixed(1) },
        ],
        kategoriRows: perKategori,
        tabelHead: ['No', 'Nama', 'Instansi', 'Kategori', 'Tujuan', 'Bertemu', 'Tgl', 'Masuk', 'Keluar'],
        tabelBody: items.map((t, i) => [
          i + 1, t.nama, t.instansi, t.kategori, t.tujuan, t.bertemu_dengan,
          wibDateStr(t.check_in_time).slice(-2), fmtJam(t.check_in_time), fmtJam(t.check_out_time),
        ]),
        namaFile: `laporan-bulanan-buku-tamu-${bulan}.pdf`,
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
      <h1 className="font-display text-2xl font-bold mb-2">Laporan Bulanan</h1>
      <p className="text-sm text-ink/70 mb-6">Rekap kunjungan tamu sekolah per bulan.</p>

      <div className="flex flex-wrap gap-2 items-center justify-between mb-5">
        <input
          type="month"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className={inputClass}
        />
        <div className="flex gap-2">
          <button
            onClick={() => items.length && unduhCsv(`laporan-buku-tamu-${bulan}.csv`, items)}
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
          <p className="text-sm text-ink/50">Belum ada data pada bulan ini.</p>
        )}
      </div>

      <div className="border border-ink/10 rounded-xl p-5 mb-5">
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

      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-base">Daftar Pengunjung Bulan Ini</h2>
        <input
          type="search"
          placeholder="Cari nama / instansi / tujuan"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className={`${inputClass} w-56`}
        />
      </div>
      <p className="text-xs text-ink/50 mb-3">Klik baris untuk meninjau detail satu per satu, sama seperti Tamu Hari Ini.</p>

      <div className="border border-ink/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-ink/70 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2.5 font-semibold">Nama</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell">Instansi</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden md:table-cell">Bertemu</th>
                <th className="text-left px-3 py-2.5 font-semibold">Tgl</th>
                <th className="text-left px-3 py-2.5 font-semibold">Masuk</th>
                <th className="text-left px-3 py-2.5 font-semibold">Keluar</th>
                <th className="text-left px-3 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-t border-ink/5">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-3 bg-ink/10 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className="border-t border-ink/5 hover:bg-ink/[0.03] cursor-pointer"
                    >
                      <td className="px-3 py-2.5 font-medium">{t.nama}</td>
                      <td className="px-3 py-2.5 text-ink/70 hidden sm:table-cell">{t.instansi}</td>
                      <td className="px-3 py-2.5 text-ink/70 hidden md:table-cell">{t.bertemu_dengan}</td>
                      <td className="px-3 py-2.5 text-ink/70">{wibDateStr(t.check_in_time).slice(-2)}</td>
                      <td className="px-3 py-2.5 text-ink/70">{fmtJam(t.check_in_time)}</td>
                      <td className="px-3 py-2.5 text-ink/70">{fmtJam(t.check_out_time)}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            t.check_out_time ? 'bg-ink/10 text-ink/60' : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {t.check_out_time ? 'Selesai' : 'Di sekolah'}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <Inbox className="w-8 h-8 mx-auto text-ink/25" />
            <p className="text-sm text-ink/60 mt-2">Belum ada tamu untuk bulan/filter ini.</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSelectedId(null)}
          className="fixed inset-0 z-50 bg-chalkboard/60 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Detail Pengunjung</h2>
              <button onClick={() => setSelectedId(null)} className="text-ink/40 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selected.foto_base64 && (
              <img
                src={selected.foto_base64}
                alt={`Foto ${selected.nama}`}
                className="w-24 h-24 object-cover rounded-xl border border-ink/10 mb-4"
              />
            )}

            <dl className="space-y-1.5 text-sm">
              {[
                ['Nama', selected.nama],
                ['No HP', selected.no_hp],
                ['Instansi', selected.instansi],
                ['Kategori', selected.kategori],
                ['Bertemu', selected.bertemu_dengan],
                ['Tujuan', selected.tujuan],
                ['Check-in', fmtTanggalJam(selected.check_in_time)],
                ['Check-out', selected.check_out_time ? fmtTanggalJam(selected.check_out_time) : 'Belum check-out'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="text-ink/50 w-24 shrink-0">{label}</dt>
                  <dd className="flex-1">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2 mt-5">
              {!selected.check_out_time && (
                <button
                  onClick={() => checkOut(selected)}
                  disabled={busy}
                  className="btn btn-primary text-sm disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" /> Catat Check-out
                </button>
              )}
              <button
                onClick={() => hapus(selected)}
                disabled={busy}
                className="text-sm px-3 py-2 rounded-lg text-rust border border-rust/30 hover:bg-rust/5 disabled:opacity-60"
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
