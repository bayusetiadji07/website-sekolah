import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { JENIS_SURAT, jenisSuratLabel, statusMeta } from '../../lib/sipas'
import { sipasLinks } from './links'
import { Download, FileDown } from 'lucide-react'

const inputCls = 'border border-ink/15 rounded-lg px-3 py-2 text-sm w-full'

const emptyFilter = { dari: '', sampai: '', jenisSurat: '', status: '', kelas: '', cari: '' }

function formatTanggal(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function toCsvValue(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export default function SipasLaporan() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(emptyFilter)

  useEffect(() => {
    supabase
      .from('pengajuan')
      .select('*')
      .order('tanggal_ajuan', { ascending: false })
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [])

  const kelasOptions = useMemo(
    () => [...new Set(items.map((i) => i.kelas).filter(Boolean))].sort(),
    [items]
  )

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filter.dari && new Date(i.tanggal_ajuan) < new Date(filter.dari)) return false
      if (filter.sampai && new Date(i.tanggal_ajuan) > new Date(`${filter.sampai}T23:59:59`)) return false
      if (filter.jenisSurat && i.jenis_surat !== filter.jenisSurat) return false
      if (filter.status && i.status !== filter.status) return false
      if (filter.kelas && i.kelas !== filter.kelas) return false
      if (filter.cari) {
        const q = filter.cari.toLowerCase()
        const match = (i.nama_siswa || '').toLowerCase().includes(q) || (i.no_tiket || '').toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [items, filter])

  const summary = useMemo(() => {
    const base = { total: filtered.length, diajukan: 0, diproses: 0, selesai: 0, ditolak: 0 }
    filtered.forEach((i) => {
      if (base[i.status] !== undefined) base[i.status] += 1
    })
    return base
  }, [filtered])

  function resetFilter() {
    setFilter(emptyFilter)
  }

  function exportCsv() {
    const header = ['No Tiket', 'Tanggal Ajuan', 'Nama Siswa', 'Kelas', 'Jenis Surat', 'Status', 'Nomor Surat', 'Keperluan', 'No Telepon', 'Catatan Admin']
    const rows = filtered.map((i) => [
      i.no_tiket,
      formatTanggal(i.tanggal_ajuan),
      i.nama_siswa,
      i.kelas,
      jenisSuratLabel(i.jenis_surat),
      statusMeta(i.status).label,
      i.nomor_surat || '',
      i.keperluan || '',
      i.no_telepon || '',
      i.catatan_admin || '',
    ])
    const csv = [header, ...rows].map((row) => row.map(toCsvValue).join(',')).join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-sipas-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout links={sipasLinks} title="SIPAS">
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2">Laporan Riwayat Pengajuan</h1>
          <p className="text-sm text-ink/70">Riwayat lengkap seluruh surat yang pernah diajukan siswa.</p>
        </div>
        <button onClick={exportCsv} className="btn btn-secondary text-sm py-2 shrink-0">
          <FileDown className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-5">
        <div className="bg-white border border-ink/10 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{summary.total}</p>
          <p className="text-xs text-ink/60">Total</p>
        </div>
        <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-sky-700">{summary.diajukan}</p>
          <p className="text-xs text-ink/60">Diajukan</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-amber-700">{summary.diproses}</p>
          <p className="text-xs text-ink/60">Diproses</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-emerald-700">{summary.selesai}</p>
          <p className="text-xs text-ink/60">Selesai</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-red-700">{summary.ditolak}</p>
          <p className="text-xs text-ink/60">Ditolak</p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-4 mb-5">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs text-ink/60 mb-1">Dari Tanggal</label>
            <input type="date" value={filter.dari} onChange={(e) => setFilter({ ...filter, dari: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-ink/60 mb-1">Sampai Tanggal</label>
            <input type="date" value={filter.sampai} onChange={(e) => setFilter({ ...filter, sampai: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-ink/60 mb-1">Jenis Surat</label>
            <select value={filter.jenisSurat} onChange={(e) => setFilter({ ...filter, jenisSurat: e.target.value })} className={inputCls}>
              <option value="">Semua</option>
              {JENIS_SURAT.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink/60 mb-1">Status</label>
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className={inputCls}>
              <option value="">Semua</option>
              <option value="diajukan">Diajukan</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink/60 mb-1">Kelas</label>
            <select value={filter.kelas} onChange={(e) => setFilter({ ...filter, kelas: e.target.value })} className={inputCls}>
              <option value="">Semua</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-ink/60 mb-1">Cari Nama / No. Tiket</label>
            <input type="text" value={filter.cari} onChange={(e) => setFilter({ ...filter, cari: e.target.value })} placeholder="Ketik untuk mencari..." className={inputCls} />
          </div>
        </div>
        <button onClick={resetFilter} className="text-xs text-ink/60 underline mt-3">Reset filter</button>
      </div>

      {loading ? (
        <p className="text-ink/70 text-sm">Memuat data...</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink/70 text-sm">Tidak ada data yang cocok dengan filter.</p>
      ) : (
        <div className="bg-white border border-ink/10 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs text-ink/60 uppercase">
                <th className="px-3 py-2 whitespace-nowrap">No. Tiket</th>
                <th className="px-3 py-2 whitespace-nowrap">Tanggal</th>
                <th className="px-3 py-2 whitespace-nowrap">Nama Siswa</th>
                <th className="px-3 py-2 whitespace-nowrap">Kelas</th>
                <th className="px-3 py-2 whitespace-nowrap">Jenis Surat</th>
                <th className="px-3 py-2 whitespace-nowrap">Status</th>
                <th className="px-3 py-2 whitespace-nowrap">Surat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">{i.no_tiket}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatTanggal(i.tanggal_ajuan)}</td>
                  <td className="px-3 py-2">{i.nama_siswa}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{i.kelas}</td>
                  <td className="px-3 py-2">{jenisSuratLabel(i.jenis_surat)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta(i.status).className}`}>
                      {statusMeta(i.status).label}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {i.file_url ? (
                      <a href={i.file_url} target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </a>
                    ) : (
                      <span className="text-ink/40">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
