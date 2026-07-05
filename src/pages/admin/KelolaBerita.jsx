import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { judul: '', isi: '', status: 'draft', foto_url: '' }

export default function KelolaBerita() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('berita_kegiatan')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `berita/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, foto_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('berita_kegiatan').update(form).eq('id', editingId)
    } else {
      await supabase.from('berita_kegiatan').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus berita ini?')) return
    await supabase.from('berita_kegiatan').delete().eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Berita & Kegiatan</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Judul berita"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Isi berita"
          required
          rows={4}
          value={form.isi}
          onChange={(e) => setForm({ ...form, isi: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/50 mt-1">Mengunggah foto...</p>}
          {form.foto_url && <img src={form.foto_url} alt="preview" className="h-24 mt-2 rounded" />}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-ink/20 rounded px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Publikasikan</option>
          </select>
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null) }} className="text-sm text-ink/60">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-start justify-between gap-4">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/60'}`}>
                {item.status === 'published' ? 'Terpublikasi' : 'Draft'}
              </span>
              <h3 className="font-display font-bold mt-1">{item.judul}</h3>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setForm({ judul: item.judul, isi: item.isi, status: item.status, foto_url: item.foto_url || '' }); setEditingId(item.id) }}
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
