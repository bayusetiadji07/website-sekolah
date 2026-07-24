import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { jenisSuratLabel, statusMeta, generateSuratPdf } from '../../lib/sipas'
import { sipasLinks } from './links'
import { FileCheck, FileX, FileDown, Loader2 } from 'lucide-react'

const TABS = [
  { value: 'diajukan', label: 'Diajukan' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
  { value: '', label: 'Semua' },
]

export default function SipasDashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [templates, setTemplates] = useState([])
  const [pengaturan, setPengaturan] = useState(null)
  const [tab, setTab] = useState('diajukan')
  const [selectedId, setSelectedId] = useState(null)
  const [catatan, setCatatan] = useState('')
  const [nomorSurat, setNomorSurat] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const { data } = await supabase.from('pengajuan').select('*').order('tanggal_ajuan', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => {
    load()
    supabase.from('template_surat').select('*').then(({ data }) => setTemplates(data || []))
    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single().then(({ data }) => setPengaturan(data))
  }, [])

  const filtered = useMemo(
    () => (tab ? items.filter((i) => i.status === tab) : items),
    [items, tab]
  )
  const selected = items.find((i) => i.id === selectedId) || null

  function selectItem(item) {
    setSelectedId(item.id)
    setCatatan(item.catatan_admin || '')
    setNomorSurat(item.nomor_surat || `400.3.5.6/    /431.301.3.9/${new Date().getFullYear()}`)
    setMsg('')
  }

  async function tandaiDiproses(item) {
    setBusy(true)
    await supabase.from('pengajuan').update({ status: 'diproses', diproses_oleh: user.id }).eq('id', item.id)
    setBusy(false)
    load()
  }

  async function setujuiDanBuatSurat(item) {
    if (!nomorSurat.trim()) {
      setMsg('Nomor surat wajib diisi sebelum membuat surat resmi.')
      return
    }
    const template = templates.find((t) => t.jenis_surat === item.jenis_surat)
    setBusy(true)
    setMsg('')
    try {
      const blob = await generateSuratPdf({ ...item, nomor_surat: nomorSurat }, pengaturan, template?.format || '')
      const path = `sipas-surat/${item.no_tiket}.pdf`
      const { error: uploadError } = await supabase.storage.from('media').upload(path, blob, {
        contentType: 'application/pdf',
        upsert: true,
      })
      if (uploadError) throw uploadError
      const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
      await supabase
        .from('pengajuan')
        .update({ status: 'selesai', file_url: pub.publicUrl, catatan_admin: catatan, nomor_surat: nomorSurat, diproses_oleh: user.id })
        .eq('id', item.id)
      await load()
      setMsg('Surat berhasil dibuat dan pengajuan ditandai selesai.')
    } catch {
      setMsg('Gagal membuat surat. Silakan coba lagi.')
    }
    setBusy(false)
  }

  async function tolak(item) {
    if (!catatan.trim()) {
      setMsg('Catatan wajib diisi untuk menolak pengajuan.')
      return
    }
    setBusy(true)
    await supabase
      .from('pengajuan')
      .update({ status: 'ditolak', catatan_admin: catatan, diproses_oleh: user.id })
      .eq('id', item.id)
    setBusy(false)
    setMsg('')
    load()
  }

  return (
    <DashboardLayout links={sipasLinks} title="SIPAS">
      <h1 className="font-display text-2xl font-bold mb-2">Antrean Pengajuan Surat</h1>
      <p className="text-sm text-ink/70 mb-6">Kelola pengajuan surat dari siswa: proses, setujui, atau tolak.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.value || 'semua'}
            onClick={() => setTab(t.value)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              tab === t.value ? 'bg-chalkboard text-paper border-chalkboard' : 'border-ink/15 text-ink/70'
            }`}
          >
            {t.label} {t.value ? `(${items.filter((i) => i.status === t.value).length})` : `(${items.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-ink/70 text-sm">Tidak ada pengajuan pada status ini.</p>}

      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
            <button
              onClick={() => selectItem(item)}
              className="w-full text-left p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-ink/60">{item.no_tiket}</p>
                <p className="font-medium truncate">{item.nama_siswa} · {item.kelas}</p>
                <p className="text-sm text-ink/70 truncate">{jenisSuratLabel(item.jenis_surat)}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${statusMeta(item.status).className}`}>
                {statusMeta(item.status).label}
              </span>
            </button>

            {selectedId === item.id && (
              <div className="border-t border-ink/10 p-4 bg-paper/50 space-y-3">
                <p className="text-sm text-ink/80 whitespace-pre-line"><span className="text-ink/60">Keperluan: </span>{item.keperluan || '-'}</p>
                {item.no_telepon && (
                  <p className="text-sm text-ink/80">
                    <span className="text-ink/60">Telepon/WA: </span>
                    <a
                      href={`https://wa.me/${item.no_telepon.replace(/^0/, '62').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {item.no_telepon}
                    </a>
                  </p>
                )}
                {item.tempat_tanggal_lahir && (
                  <p className="text-sm text-ink/80">
                    <span className="text-ink/60">Tempat/Tgl. Lahir: </span>{item.tempat_tanggal_lahir}
                  </p>
                )}
                {item.tanggal_butuh && (
                  <p className="text-sm text-ink/80">
                    <span className="text-ink/60">Dibutuhkan sebelum: </span>
                    {new Date(item.tanggal_butuh).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
                {item.status !== 'selesai' && (
                  <div>
                    <label className="block text-xs text-ink/60 mb-1">Nomor Surat (utk PDF resmi)</label>
                    <input
                      type="text"
                      value={nomorSurat}
                      onChange={(e) => setNomorSurat(e.target.value)}
                      className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm font-mono"
                    />
                  </div>
                )}
                <textarea
                  rows={2}
                  placeholder="Catatan untuk siswa (wajib jika menolak)"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm resize-none"
                />
                {msg && <p className="text-xs text-rust">{msg}</p>}
                <div className="flex flex-wrap gap-2">
                  {item.status === 'diajukan' && (
                    <button disabled={busy} onClick={() => tandaiDiproses(item)} className="btn btn-outline text-sm py-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Tandai Diproses
                    </button>
                  )}
                  {item.status !== 'selesai' && (
                    <button disabled={busy} onClick={() => setujuiDanBuatSurat(item)} className="btn btn-primary text-sm py-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                      Setujui &amp; Buat Surat
                    </button>
                  )}
                  {item.status !== 'ditolak' && item.status !== 'selesai' && (
                    <button disabled={busy} onClick={() => tolak(item)} className="btn btn-ghost text-sm py-2 text-rust">
                      <FileX className="w-4 h-4" />
                      Tolak
                    </button>
                  )}
                  {item.file_url && (
                    <a href={item.file_url} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm py-2">
                      <FileDown className="w-4 h-4" />
                      Unduh Surat
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
