import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import { compressImage } from '../../lib/compressImage'

const empty = { nama_guru: '', mapel: '', url: '', deskripsi: '', ikon_url: '', aktif: true, urutan: 0 }

export default function KelolaPembelajaran() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('pembelajaran_links').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const compressed = await compressImage(file)
    const path = `pembelajaran/${Date.now()}-${compressed.name}`
    const { error } = await supabase.storage.from('media').upload(path, compressed)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, ikon_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('pembelajaran_links').update(form).eq('id', editingId)
    } else {
      await supabase.from('pembelajaran_links').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('pembelajaran_links').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus tautan ini?')) return
    await supabase.from('pembelajaran_links').delete().eq('id', id)
    load()
  }

  const inputCls = 'w-full border border-ink/20 rounded px-3 py-2 text-sm'

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Pembelajaran</h1>
      <p className="text-sm text-ink/70 mb-4">
        Tautkan web atau site pribadi guru untuk materi pembelajaran ke halaman "Pembelajaran" pada navigasi.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Nama guru"
          required
          value={form.nama_guru}
          onChange={(e) => setForm({ ...form, nama_guru: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="Mata pelajaran (opsional)"
          value={form.mapel}
          onChange={(e) => setForm({ ...form, mapel: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="URL web/site guru (https://...)"
          required
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="Deskripsi singkat (opsional)"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className={inputCls}
        />
        <div>
          <span className="block text-xs text-ink/70 mb-1">Foto/ikon (opsional, jika kosong pakai huruf inisial)</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah...</p>}
          {form.ikon_url && <img src={form.ikon_url} alt="preview" className="h-16 w-16 object-cover rounded-full mt-2" />}
        </div>
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Tautan'}
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
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {item.ikon_url ? (
                <img src={item.ikon_url} alt={item.nama_guru} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard shrink-0">
                  {item.nama_guru?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-display font-bold">{item.nama_guru}</h3>
                <p className="text-sm text-ink/70">{item.mapel ? `${item.mapel} · ` : ''}{item.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAktif(item)}
                className={`text-xs font-medium px-3 py-1 rounded ${item.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}
              >
                {item.aktif ? 'Tampil' : 'Disembunyikan'}
              </button>
              <button onClick={() => { setForm(item); setEditingId(item.id) }} className="text-sm text-chalkboard underline">Ubah</button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-rust underline">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
