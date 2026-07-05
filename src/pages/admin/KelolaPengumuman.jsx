import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = { judul: '', isi: '', status: 'draft' }

export default function KelolaPengumuman() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase
      .from('pengumuman')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

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
    setForm({ judul: item.judul, isi: item.isi, status: item.status })
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
              className="text-sm text-ink/60"
            >
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
              <p className="text-sm text-ink/60 line-clamp-2">{item.isi}</p>
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
