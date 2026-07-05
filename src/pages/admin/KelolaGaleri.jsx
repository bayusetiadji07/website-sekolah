import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { judul: '', foto_url: '', keterangan: '', aktif: true, urutan: 0 }

export default function KelolaGaleri() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('galeri').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `galeri/${Date.now()}-${file.name}`
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
      await supabase.from('galeri').update(form).eq('id', editingId)
    } else {
      await supabase.from('galeri').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('galeri').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('galeri').delete().eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Galeri Foto</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Judul foto"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Keterangan (opsional)"
          value={form.keterangan}
          onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/50 mt-1">Mengunggah foto...</p>}
          {form.foto_url && <img src={form.foto_url} alt="preview" className="h-24 mt-2 rounded" />}
        </div>
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Foto'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(empty); setEditingId(null) }} className="text-sm text-ink/60">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
            <img src={item.foto_url} alt={item.judul} className="w-full h-32 object-cover" />
            <div className="p-3">
              <h3 className="font-display font-bold text-sm">{item.judul}</h3>
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => toggleAktif(item)}
                  className={`text-xs font-medium px-2 py-0.5 rounded ${item.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/60'}`}
                >
                  {item.aktif ? 'Tampil' : 'Disembunyikan'}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => { setForm(item); setEditingId(item.id) }} className="text-xs text-chalkboard underline">Ubah</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-rust underline">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
