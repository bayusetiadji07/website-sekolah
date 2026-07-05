import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const defaultSections = [
  { key: 'profil', label: 'Tentang Kami', aktif: true },
  { key: 'berita', label: 'Berita & Kegiatan', aktif: true },
  { key: 'galeri', label: 'Galeri Foto', aktif: true },
  { key: 'aplikasi', label: 'Aplikasi Sekolah', aktif: true },
  { key: 'kontak', label: 'Kontak', aktif: true },
]

export default function KelolaTampilan() {
  const [sections, setSections] = useState(defaultSections)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('beranda_sections').eq('id', 1).single()
      .then(({ data }) => {
        if (data?.beranda_sections?.length) setSections(data.beranda_sections)
      })
  }, [])

  function toggleAktif(key) {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, aktif: !s.aktif } : s)))
  }

  function move(index, dir) {
    setSections((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('pengaturan_sekolah').update({ beranda_sections: sections }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-2">Pengaturan Tampilan</h1>
      <p className="text-sm text-ink/70 mb-6">
        Atur urutan dan tampilkan/sembunyikan bagian "Jelajahi Website" di halaman Beranda.
      </p>

      <div className="bg-white border border-ink/10 rounded-lg divide-y divide-ink/10 max-w-xl">
        {sections.map((s, i) => (
          <div key={s.key} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-ink/70 hover:text-chalkboard disabled:opacity-20 leading-none text-xs"
                  aria-label="Naikkan urutan"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === sections.length - 1}
                  className="text-ink/70 hover:text-chalkboard disabled:opacity-20 leading-none text-xs"
                  aria-label="Turunkan urutan"
                >
                  ▼
                </button>
              </div>
              <span className="font-medium text-sm">{s.label}</span>
            </div>
            <button
              type="button"
              onClick={() => toggleAktif(s.key)}
              className={`text-xs font-medium px-3 py-1 rounded shrink-0 ${s.aktif ? 'bg-amber/20 text-rust' : 'bg-ink/10 text-ink/70'}`}
            >
              {s.aktif ? 'Tampil' : 'Disembunyikan'}
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-chalkboard text-paper px-5 py-2.5 rounded text-sm font-medium disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        {saved && <span className="text-sm text-rust">Tersimpan.</span>}
      </div>
    </DashboardLayout>
  )
}
