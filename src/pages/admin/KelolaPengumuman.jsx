import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import { compressImage } from '../../lib/compressImage'

const empty = { judul: '', isi: '', status: 'draft', foto_url: '', file_url: '', link_url: '' }

export default function KelolaPengumuman() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const compressed = await compressImage(file)
    const path = `pengumuman/${Date.now()}-${compressed.name}`
    const { error } = await supabase.storage.from('media').upload(path, compressed)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, foto_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleUploadFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingFile(true)
    const compressed = await compressImage(file)
    const path = `pengumuman-lampiran/${Date.now()}-${compressed.name}`
    const { error } = await supabase.storage.from('media').upload(path, compressed)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, file_url: data.publicUrl }))
    }
    setUploadingFile(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('pengumuman').update(form).eq('id', editingId)
    } else {
      await supabase.from('pengumuman').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus pengumuman ini?')) return
    await supabase.from('pengumuman').delete().eq('id', id)
    load()
  }

  function handleEdit(item) {
    setForm({
      judul: item.judul,
      isi: item.isi,
      status: item.status,
      foto_url: item.foto_url || '',
      file_url: item.file_url || '',
      link_url: item.link_url || '',
    })
    setEditingId(item.id)
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Pengumuman</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Judul pengumuman"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Isi pengumuman"
          required
          rows={4}
          value={form.isi}
          onChange={(e) => setForm({ ...form, isi: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <div>
          <span className="block text-xs text-ink/70 mb-1">Foto pengumuman (opsional)</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah foto...</p>}
          {form.foto_url && <img src={form.foto_url} alt="preview" className="h-24 mt-2 rounded" />}
        </div>
        <div>
          <span className="block text-xs text-ink/70 mb-1">Lampiran file yang bisa diunduh (PDF, dokumen, dll — opsional)</span>
          <input type="file" onChange={handleUploadFile} className="text-sm" />
          {uploadingFile && <p className="text-xs text-ink/70 mt-1">Mengunggah file...</p>}
          {form.file_url && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-rust truncate">{decodeURIComponent(form.file_url.split('/').pop())}</p>
              <button type="button" onClick={() => setForm((f) => ({ ...f, file_url: '' }))} className="text-xs text-ink/70 underline shrink-0">
                Hapus
              </button>
            </div>
          )}
        </div>
        <input
          placeholder="Link forward (opsional, contoh: https://... untuk info selengkapnya)"
          value={form.link_url}
          onChange={(e) => setForm({ ...form, link_url: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
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
            {editingId ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setForm(empty); setEditingId(null) }}
              className="text-sm text-ink/70"
            >
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
                <p className="text-sm text-ink/70 line-clamp-2">{item.isi}</p>
                <div className="flex gap-3 mt-1">
                  {item.file_url && <span className="text-xs text-rust">📎 Ada lampiran file</span>}
                  {item.link_url && <span className="text-xs text-rust">🔗 Ada link forward</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(item)} className="text-sm text-chalkboard underline">Ubah</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-rust underline">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
