import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ pengumuman: 0, berita: 0, materi: 0, guru: 0 })

  useEffect(() => {
    async function load() {
      const [p, b, m, g] = await Promise.all([
        supabase.from('pengumuman').select('id', { count: 'exact', head: true }),
        supabase.from('berita_kegiatan').select('id', { count: 'exact', head: true }),
        supabase.from('materi').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'guru'),
      ])
      setCounts({
        pengumuman: p.count || 0,
        berita: b.count || 0,
        materi: m.count || 0,
        guru: g.count || 0,
      })
    }
    load()
  }, [])

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Ringkasan</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pengumuman', value: counts.pengumuman },
          { label: 'Berita', value: counts.berita },
          { label: 'Materi', value: counts.materi },
          { label: 'Guru Aktif', value: counts.guru },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-ink/10 rounded-lg p-5">
            <p className="text-2xl font-display font-bold">{c.value}</p>
            <p className="text-sm text-ink/60">{c.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
