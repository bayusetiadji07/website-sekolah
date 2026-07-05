import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { nama: '', deskripsi: '', logo_url: '', url: '', aktif: true, urutan: 0 }

export default function KelolaKemitraan() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('kemitraan').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `kemitraan/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, logo_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('kemitraan').update(form).eq('id', editingId)
    } else {
      await supabase.from('kemitraan').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('kemitraan').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus mitra ini?')) return
    await supabase.from('kemitraan').delete().eq('id', id)
    load()
  }

  const inputCls = 'w-full border border-ink/20 rounded px-3 py-2 text-sm'

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Kemitraan Sekolah</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Nama mitra"
          required
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className={inputCls}
        />
        <textarea
          placeholder="Deskripsi singkat kerja sama"
          rows={3}
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="Link website mitra (opsional)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className={inputCls}
        />
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah logo...</p>}
          {form.logo_url && <img src={form.logo_url} alt="preview" className="h-16 w-16 object-contain mt-2 rounded bg-paper border border-ink/10 p-1" />}
        </div>
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Mitra'}
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
              {item.logo_url ? (
                <img src={item.logo_url} alt={item.nama} className="w-10 h-10 object-contain rounded bg-paper border border-ink/10 p-1 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard shrink-0">
                  {item.nama?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-display font-bold">{item.nama}</h3>
                <p className="text-sm text-ink/70">{item.deskripsi}</p>
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
