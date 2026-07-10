import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { guruLinks } from './links'
import { compressImage } from '../../lib/compressImage'

const empty = { judul: '', mapel: '', kelas: '', tipe: 'file', link_url: '', status: 'draft' }

export default function KelolaMateriGuru() {
  const { user, profile } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase
      .from('materi')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { if (user) load() }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let file_url = editingId ? undefined : null
    if (form.tipe === 'file' && file) {
      const compressed = await compressImage(file)
      const path = `materi/${user.id}/${Date.now()}-${compressed.name}`
      const { error } = await supabase.storage.from('media').upload(path, compressed)
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        file_url = data.publicUrl
      }
    }

    const payload = {
      judul: form.judul,
      mapel: form.mapel,
      kelas: form.kelas,
      status: form.status,
      link_url: form.tipe === 'link' ? form.link_url : null,
      ...(file_url !== undefined ? { file_url } : {}),
      uploaded_by: user.id,
    }

    if (editingId) {
      await supabase.from('materi').update(payload).eq('id', editingId)
    } else {
      await supabase.from('materi').insert(payload)
    }

    setForm(empty)
    setFile(null)
    setEditingId(null)
    setSaving(false)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus materi ini?')) return
    await supabase.from('materi').delete().eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={guruLinks} title="Guru">
      <h1 className="font-display text-2xl font-bold mb-1">Materi Saya</h1>
      <p className="text-sm text-ink/70 mb-6">{profile?.mapel && `Mapel: ${profile.mapel}`}</p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-3">
        <input
          placeholder="Judul materi"
          required
          value={form.judul}
          onChange={(e) => setForm({ ...form, judul: e.target.value })}
          className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
        />
        <div className="flex gap-3">
          <input
            placeholder="Mapel"
            required
            value={form.mapel}
            onChange={(e) => setForm({ ...form, mapel: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Kelas (contoh: VIII)"
            required
            value={form.kelas}
            onChange={(e) => setForm({ ...form, kelas: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={form.tipe === 'file'} onChange={() => setForm({ ...form, tipe: 'file' })} />
            Upload File
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" checked={form.tipe === 'link'} onChange={() => setForm({ ...form, tipe: 'link' })} />
            Tautkan Link
          </label>
        </div>

        {form.tipe === 'file' ? (
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        ) : (
          <input
            placeholder="Link (Google Drive, YouTube, dll)"
            value={form.link_url}
            onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
        )}

        <div className="flex items-center gap-3">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-ink/20 rounded px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Publikasikan</option>
          </select>
          <button disabled={saving} className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium disabled:opacity-60">
            {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Materi'}
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
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}>
                {item.status === 'published' ? 'Terpublikasi' : 'Draft'}
              </span>
              <h3 className="font-display font-bold mt-1">{item.judul}</h3>
              <p className="text-xs text-ink/70">{item.mapel} · {item.kelas}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setForm({
                    judul: item.judul, mapel: item.mapel, kelas: item.kelas,
                    tipe: item.link_url ? 'link' : 'file', link_url: item.link_url || '', status: item.status,
                  })
                  setEditingId(item.id)
                }}
                className="text-sm text-chalkboard underline"
              >
                Ubah
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-rust underline">Hapus</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/70 text-sm">Belum ada materi yang diunggah.</p>}
      </div>
    </DashboardLayout>
  )
}
