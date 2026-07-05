import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { nama: '', url: '', deskripsi: '', ikon_url: '', aktif: true, urutan: 0 }

export default function KelolaAplikasi() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase.from('app_links').select('*').order('urutan')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

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
      <p className="text-sm text-ink/60 mb-4">
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
        <div className="flex gap-3">
          <button className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Aplikasi'}
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
            <div>
              <h3 className="font-display font-bold">{item.nama}</h3>
              <p className="text-sm text-ink/60">{item.url}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAktif(item)}
                className={`text-xs font-medium px-3 py-1 rounded ${item.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/60'}`}
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
