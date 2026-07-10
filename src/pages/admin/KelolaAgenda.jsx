import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import { compressImage } from '../../lib/compressImage'

const empty = { judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', lokasi: '', status: 'draft', foto_url: '' }

export default function KelolaAgenda() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('agenda').select('*').order('tanggal_mulai', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const compressed = await compressImage(file)
    const path = `agenda/${Date.now()}-${compressed.name}`
    const { error } = await supabase.storage.from('media').upload(path, compressed)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, foto_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('agenda').update(form).eq('id', editingId)
    } else {
      await supabase.from('agenda').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus agenda ini?')) return
    await supabase.from('agenda').delete().eq('id', id)
    load()
  }

  const inputCls = 'border border-ink/20 rounded px-3 py-2 text-sm'

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Agenda Kegiatan</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Judul kegiatan"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className={`w-full ${inputCls}`}
        />
        <textarea
          placeholder="Deskripsi"
          rows={3}
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className={`w-full ${inputCls}`}
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs text-ink/70 mb-1">Tanggal mulai</span>
            <input type="date" required value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} className={`w-full ${inputCls}`} />
          </label>
          <label className="block">
            <span className="block text-xs text-ink/70 mb-1">Tanggal selesai (opsional)</span>
            <input type="date" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} className={`w-full ${inputCls}`} />
          </label>
        </div>
        <input
          placeholder="Lokasi"
          value={form.lokasi}
          onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
          className={`w-full ${inputCls}`}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah foto...</p>}
          {form.foto_url && <img src={form.foto_url} alt="preview" className="h-24 mt-2 rounded" />}
        </div>
        <div className="flex items-center gap-3">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Publikasikan</option>
          </select>
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Agenda'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null) }} className="text-sm text-ink/70">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {item.foto_url && (
                <img src={item.foto_url} alt={item.judul} className="w-16 h-16 object-cover rounded shrink-0" />
              )}
              <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}>
                {item.status === 'published' ? 'Terpublikasi' : 'Draft'}
              </span>
              <h3 className="font-display font-bold mt-1">{item.judul}</h3>
              <p className="text-xs text-ink/70">
                {item.tanggal_mulai}{item.tanggal_selesai && item.tanggal_selesai !== item.tanggal_mulai ? ` – ${item.tanggal_selesai}` : ''}
                {item.lokasi ? ` · ${item.lokasi}` : ''}
              </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setForm({ judul: item.judul, deskripsi: item.deskripsi || '', tanggal_mulai: item.tanggal_mulai, tanggal_selesai: item.tanggal_selesai || '', lokasi: item.lokasi || '', status: item.status, foto_url: item.foto_url || '' }); setEditingId(item.id) }}
                className="text-sm text-chalkboard underline"
              >
                Ubah
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-rust underline">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
