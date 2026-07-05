import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { nama: '', url: '', deskripsi: '', ikon_url: '', aktif: true, urutan: 0 }

export default function KelolaAplikasi() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('app_links').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `aplikasi/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, ikon_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('app_links').update(form).eq('id', editingId)
    } else {
      await supabase.from('app_links').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('app_links').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus aplikasi ini dari daftar?')) return
    await supabase.from('app_links').delete().eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Aplikasi Sekolah</h1>
      <p className="text-sm text-ink/70 mb-4">
        Tautkan aplikasi seperti eAsesmen, SI Diswa, dan administrasi sekolah ke halaman publik "Aplikasi Sekolah".
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Nama aplikasi (contoh: eAsesmen)"
          required
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="URL aplikasi (https://...)"
          required
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <input
          placeholder="Deskripsi singkat"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <div>
          <span className="block text-xs text-ink/70 mb-1">Logo aplikasi (opsional, jika kosong pakai huruf inisial)</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah logo...</p>}
          {form.ikon_url && <img src={form.ikon_url} alt="preview" className="h-16 w-16 object-contain mt-2 rounded bg-white border border-ink/10 p-1" />}
        </div>
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Aplikasi'}
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
                <img src={item.ikon_url} alt={item.nama} className="w-10 h-10 object-contain rounded bg-paper border border-ink/10 p-1 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard shrink-0">
                  {item.nama?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-display font-bold">{item.nama}</h3>
                <p className="text-sm text-ink/70">{item.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAktif(item)}
                className={`text-xs font-medium px-3 py-1 rounded ${item.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}
              >
                {item.aktif ? 'Tampil' : 'Disembunyikan'}
              </button>
              <button
                onClick={() => { setForm(item); setEditingId(item.id) }}
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
