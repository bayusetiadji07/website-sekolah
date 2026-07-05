import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { nama: '', jabatan: '', kategori: 'pendidik', foto_url: '', aktif: true, urutan: 0 }

export default function KelolaTenagaPendidik() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const { data } = await supabase.from('tenaga_pendidik').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `tenaga-pendidik/${Date.now()}-${file.name}`
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
      await supabase.from('tenaga_pendidik').update(form).eq('id', editingId)
    } else {
      await supabase.from('tenaga_pendidik').insert(form)
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('tenaga_pendidik').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus data ini?')) return
    await supabase.from('tenaga_pendidik').delete().eq('id', id)
    load()
  }

  const inputCls = 'w-full border border-ink/20 rounded px-3 py-2 text-sm'

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Tenaga Pendidik & Kependidikan</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Nama"
          required
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="Jabatan (contoh: Guru Matematika, Tata Usaha)"
          required
          value={form.jabatan}
          onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
          className={inputCls}
        />
        <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className={inputCls}>
          <option value="pendidik">Tenaga Pendidik (Guru)</option>
          <option value="kependidikan">Tenaga Kependidikan</option>
        </select>
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          {uploading && <p className="text-xs text-ink/50 mt-1">Mengunggah foto...</p>}
          {form.foto_url && <img src={form.foto_url} alt="preview" className="h-20 w-20 rounded-full object-cover mt-2" />}
        </div>
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Data'}
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
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {item.foto_url ? (
                <img src={item.foto_url} alt={item.nama} className="w-12 h-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-chalkboard/10 flex items-center justify-center font-display font-bold text-chalkboard shrink-0">
                  {item.nama?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-display font-bold">{item.nama}</h3>
                <p className="text-sm text-ink/60">{item.jabatan} · {item.kategori === 'pendidik' ? 'Pendidik' : 'Kependidikan'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAktif(item)}
                className={`text-xs font-medium px-3 py-1 rounded ${item.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/60'}`}
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
