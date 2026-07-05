import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

export default function KelolaUser() {
  const [items, setItems] = useState([])

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('nama')
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function updateRole(id, role) {
    await supabase.from('profiles').update({ role }).eq('id', id)
    load()
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-2">Kelola Guru & Pengguna</h1>
      <p className="text-sm text-ink/70 mb-6">
        Akun baru dibuat lewat Supabase Authentication (undangan email), lalu tetapkan perannya di sini.
      </p>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{item.nama || item.email || item.id}</p>
              <p className="text-xs text-ink/70">{item.email}</p>
            </div>
            <select
              value={item.role || ''}
              onChange={(e) => updateRole(item.id, e.target.value)}
              className="border border-ink/20 rounded px-3 py-1.5 text-sm"
            >
              <option value="">Belum ada peran</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
        {items.length === 0 && <p className="text-ink/70 text-sm">Belum ada pengguna terdaftar.</p>}
      </div>
    </DashboardLayout>
  )
}
