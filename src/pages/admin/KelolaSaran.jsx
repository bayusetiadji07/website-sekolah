import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

export default function KelolaSaran() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase.from('saran').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function toggleDibaca(item) {
    await supabase.from('saran').update({ dibaca: !item.dibaca }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus saran ini?')) return
    await supabase.from('saran').delete().eq('id', id)
    load()
  }

  const belumDibaca = items.filter((i) => !i.dibaca).length

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-2">Kotak Saran</h1>
      <p className="text-sm text-ink/70 mb-6">
        Saran dan masukan dari pengunjung website. {belumDibaca > 0 && `${belumDibaca} belum dibaca.`}
      </p>

      {items.length === 0 ? (
        <p className="text-ink/70">Belum ada saran yang masuk.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${!item.dibaca ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}>
                    {item.dibaca ? 'Sudah dibaca' : 'Belum dibaca'}
                  </span>
                  <p className="text-xs text-ink/70 mt-1">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {item.nama || 'Anonim'}
                    {item.kontak ? ` (${item.kontak})` : ''}
                  </p>
                  <p className="text-ink/80 mt-2 whitespace-pre-line">{item.isi}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0 items-end">
                  <button onClick={() => toggleDibaca(item)} className="text-xs text-chalkboard underline whitespace-nowrap">
                    {item.dibaca ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-rust underline">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
