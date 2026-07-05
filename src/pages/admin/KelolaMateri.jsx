import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

export default function KelolaMateriAdmin() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase
      .from('materi')
      .select('*, profiles:uploaded_by (nama, mapel)')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function toggleStatus(item) {
    const status = item.status === 'published' ? 'draft' : 'published'
    await supabase.from('materi').update({ status }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus materi ini?')) return
    await supabase.from('materi').delete().eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-2">Semua Materi</h1>
      <p className="text-sm text-ink/70 mb-6">Materi yang diunggah oleh seluruh guru.</p>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-start justify-between gap-4">
            <div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.status === 'published' ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}>
                {item.status === 'published' ? 'Terpublikasi' : 'Draft'}
              </span>
              <h3 className="font-display font-bold mt-1">{item.judul}</h3>
              <p className="text-xs text-ink/70">
                {item.mapel} · {item.kelas} · diunggah oleh {item.profiles?.nama || 'Guru'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleStatus(item)} className="text-sm text-chalkboard underline">
                {item.status === 'published' ? 'Sembunyikan' : 'Publikasikan'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-rust underline">Hapus</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/70 text-sm">Belum ada materi.</p>}
      </div>
    </DashboardLayout>
  )
}
