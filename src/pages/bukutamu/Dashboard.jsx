import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { bukuTamuLinks } from './links'
import {
  KATEGORI_KUNJUNGAN,
  fmtJam,
  fmtTanggalJam,
  hariIniStr,
  unduhCsv,
} from '../../lib/bukuTamu'
import { Download, Inbox, LogOut, Printer, X } from 'lucide-react'

export default function BukuTamuDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [tanggal, setTanggal] = useState(hariIniStr())
  const [kategori, setKategori] = useState('')
  const [cari, setCari] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function load(tgl) {
    setLoading(true)
    const { data, error } = await supabase
      .from('bt_visitors')
      .select('*')
      .gte('check_in_time', `${tgl}T00:00:00+07:00`)
      .lte('check_in_time', `${tgl}T23:59:59+07:00`)
      .order('check_in_time', { ascending: false })
    setLoading(false)
    if (error) {
      setMsg('Gagal memuat data tamu. Periksa koneksi internet.')
      return
    }
    setMsg('')
    setItems(data || [])
  }

  useEffect(() => { load(tanggal) }, [tanggal])

  const filtered = useMemo(() => {
    const q = cari.trim().toLowerCase()
    return items.filter((t) => {
      if (kategori && t.kategori !== kategori) return false
      if (q && !`${t.nama} ${t.instansi} ${t.tujuan}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, kategori, cari])

  const perKategori = useMemo(() => {
    const acc = {}
    items.forEach((t) => { acc[t.kategori] = (acc[t.kategori] || 0) + 1 })
    return Object.entries(acc)
  }, [items])

  const selected = items.find((t) => t.id === selectedId) || null

  async function checkOut(item) {
    setBusy(true)
    const { error } = await supabase
      .from('bt_visitors')
      .update({ check_out_time: new Date().toISOString() })
      .eq('id', item.id)
    setBusy(false)
    if (error) { setMsg('Gagal mencatat check-out.'); return }
    setSelectedId(null)
    load(tanggal)
  }

  async function hapus(item) {
    if (!confirm(`Hapus data kunjungan ${item.nama}? Tindakan ini tidak bisa dibatalkan.`)) return
    setBusy(true)
    const { error } = await supabase.from('bt_visitors').delete().eq('id', item.id)
    setBusy(false)
    if (error) { setMsg('Gagal menghapus data.'); return }
    setSelectedId(null)
    load(tanggal)
  }

  function cetak() {
    const baris = items
      .map((t) => `<tr>${[
        t.nama, t.instansi, t.kategori, t.tujuan, t.bertemu_dengan,
        fmtJam(t.check_in_time), fmtJam(t.check_out_time),
      ].map((v) => `<td>${v || '-'}</td>`).join('')}</tr>`)
      .join('')
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Laporan Buku Tamu ${tanggal}</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:24px;color:#1e293b}
        h1{font-size:18px;margin:0 0 4px}
        p{font-size:13px;color:#64748b;margin:0 0 12px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #cbd5e1;padding:5px 6px;text-align:left}
        th{background:#f1f5f9}
      </style></head><body>
      <h1>Laporan Buku Tamu — SMP Negeri 3 Besuki</h1>
      <p>Tanggal: ${tanggal} &nbsp;|&nbsp; Total pengunjung: ${items.length}</p>
      <table><thead><tr>
        <th>Nama</th><th>Instansi</th><th>Kategori</th><th>Tujuan</th>
        <th>Bertemu</th><th>Masuk</th><th>Keluar</th>
      </tr></thead><tbody>${baris}</tbody></table>
      </body></html>`)
    win.document.close()
    win.print()
  }

  const inputClass = 'border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary'

  return (
    <DashboardLayout links={bukuTamuLinks} title="Buku Tamu">
      <h1 className="font-display text-2xl font-bold mb-2">Tamu Hari Ini</h1>
      <p className="text-sm text-ink/70 mb-6">
        Pantau kunjungan, catat check-out, dan cetak laporan harian.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="border border-ink/10 rounded-xl p-4">
          <p className="text-xs text-ink/60">Pengunjung</p>
          <p className="text-2xl font-bold">{items.length}</p>
        </div>
        <div className="border border-ink/10 rounded-xl p-4">
          <p className="text-xs text-ink/60">Sedang di sekolah</p>
          <p className="text-2xl font-bold text-accent">
            {items.filter((t) => !t.check_out_time).length}
          </p>
        </div>
        <div className="border border-ink/10 rounded-xl p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-ink/60 mb-1">Per kategori</p>
          {perKategori.length ? (
            perKategori.map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="truncate pr-2">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-ink/50">Belum ada data</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className={inputClass} />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={inputClass}>
          <option value="">Semua kategori</option>
          {KATEGORI_KUNJUNGAN.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <input
          type="search"
          placeholder="Cari nama / instansi / tujuan"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className={`${inputClass} flex-1 min-w-[180px]`}
        />
        <button
          onClick={() => items.length && unduhCsv(`buku-tamu-${tanggal}.csv`, items)}
          disabled={!items.length}
          className="text-sm px-3 py-2 rounded-lg border border-ink/15 inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
        <button
          onClick={cetak}
          disabled={!items.length}
          className="text-sm px-3 py-2 rounded-lg border border-ink/15 inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak
        </button>
      </div>

      {msg && <p className="text-sm text-rust bg-rust/10 border border-rust/20 rounded-lg px-3 py-2 mb-4">{msg}</p>}

      <div className="border border-ink/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-ink/70 text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-2.5 font-semibold">Nama</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell">Instansi</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden md:table-cell">Bertemu</th>
                <th className="text-left px-3 py-2.5 font-semibold">Masuk</th>
                <th className="text-left px-3 py-2.5 font-semibold">Keluar</th>
                <th className="text-left px-3 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-t border-ink/5">
                      {Array.from({ length: 6 }).map((__, j) => (
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
            <p className="text-sm text-ink/60 mt-2">Belum ada tamu untuk filter ini.</p>
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
