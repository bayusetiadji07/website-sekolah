import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const quickActions = [
  { to: '/admin/pengumuman', label: 'Tambah Pengumuman' },
  { to: '/admin/berita', label: 'Tambah Berita' },
  { to: '/admin/agenda', label: 'Tambah Agenda' },
  { to: '/admin/galeri', label: 'Tambah Foto Galeri' },
  { to: '/admin/aplikasi', label: 'Atur Aplikasi Sekolah' },
  { to: '/admin/profil', label: 'Atur Profil & Kontak' },
  { to: '/admin/tampilan', label: 'Atur Tampilan Website' },
  { to: '/admin/pengguna', label: 'Kelola Guru' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ pengumuman: 0, berita: 0, agenda: 0, galeri: 0, materi: 0, guru: 0 })

  useEffect(() => {
    async function load() {
      const [p, b, ag, gal, m, g] = await Promise.all([
        supabase.from('pengumuman').select('id', { count: 'exact', head: true }),
        supabase.from('berita_kegiatan').select('id', { count: 'exact', head: true }),
        supabase.from('agenda').select('id', { count: 'exact', head: true }),
        supabase.from('galeri').select('id', { count: 'exact', head: true }),
        supabase.from('materi').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'guru'),
      ])
      setCounts({
        pengumuman: p.count || 0,
        berita: b.count || 0,
        agenda: ag.count || 0,
        galeri: gal.count || 0,
        materi: m.count || 0,
        guru: g.count || 0,
      })
    }
    load()
  }, [])

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Ringkasan</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Pengumuman', value: counts.pengumuman },
          { label: 'Berita', value: counts.berita },
          { label: 'Agenda', value: counts.agenda },
          { label: 'Galeri Foto', value: counts.galeri },
          { label: 'Materi', value: counts.materi },
          { label: 'Guru Aktif', value: counts.guru },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-ink/10 rounded-lg p-5">
            <p className="text-2xl font-display font-bold">{c.value}</p>
            <p className="text-sm text-ink/60">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-bold mt-10 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="bg-white border border-ink/10 rounded-lg p-4 text-sm font-medium hover:border-amber hover:text-rust transition-colors"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
