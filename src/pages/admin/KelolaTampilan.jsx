import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import ReorderableToggleList from '../../components/ReorderableToggleList'

const defaultBlocks = [
  { key: 'statistik', label: 'Statistik Sekolah', aktif: true },
  { key: 'sambutan', label: 'Sambutan Kepala Sekolah', aktif: true },
  { key: 'jelajahi', label: 'Jelajahi Website', aktif: true },
  { key: 'prestasi', label: 'Prestasi Sekolah', aktif: true },
  { key: 'pengumuman', label: 'Pengumuman Terbaru', aktif: true },
  { key: 'marquee', label: 'Galeri Berjalan', aktif: true },
]

const defaultSections = [
  { key: 'profil', label: 'Tentang Kami', aktif: true },
  { key: 'berita', label: 'Berita & Kegiatan', aktif: true },
  { key: 'galeri', label: 'Galeri Foto', aktif: true },
  { key: 'aplikasi', label: 'Aplikasi Sekolah', aktif: true },
  { key: 'kontak', label: 'Kontak', aktif: true },
]

function move(list, index, dir) {
  const next = [...list]
  const target = index + dir
  if (target < 0 || target >= next.length) return list
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export default function KelolaTampilan() {
  const [blocks, setBlocks] = useState(defaultBlocks)
  const [sections, setSections] = useState(defaultSections)
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('beranda_sections, beranda_blocks, hero_image_url').eq('id', 1).single()
      .then(({ data }) => {
        if (data?.beranda_sections?.length) setSections(data.beranda_sections)
        if (data?.beranda_blocks?.length) setBlocks(data.beranda_blocks)
        setHeroImageUrl(data?.hero_image_url || '')
      })
  }, [])

  async function handleUploadHero(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `hero/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setHeroImageUrl(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('pengaturan_sekolah').update({
      beranda_sections: sections,
      beranda_blocks: blocks,
      hero_image_url: heroImageUrl,
    }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-2">Pengaturan Tampilan</h1>
      <p className="text-sm text-ink/70 mb-6">
        Atur tampilan halaman Beranda: gambar hero, susunan bagian, dan isi "Jelajahi Website".
      </p>

      <section className="bg-white border border-ink/10 rounded-lg p-5 mb-8 max-w-xl">
        <h2 className="font-display font-bold mb-1">Gambar Latar Hero</h2>
        <p className="text-xs text-ink/70 mb-3">
          Gambar besar di bagian paling atas Beranda. Kalau kosong, latar polos warna navy yang dipakai.
        </p>
        <input type="file" accept="image/*" onChange={handleUploadHero} className="text-sm" />
        {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah...</p>}
        {heroImageUrl && (
          <div className="mt-3">
            <img src={heroImageUrl} alt="preview hero" className="w-full h-32 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => setHeroImageUrl('')}
              className="text-xs text-rust underline mt-1"
            >
              Hapus gambar
            </button>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold mb-1">Susunan Halaman Beranda</h2>
        <p className="text-xs text-ink/70 mb-3">
          Atur urutan dan tampil/sembunyikan bagian-bagian di halaman Beranda (di bawah hero). Bagian yang datanya
          masih kosong (mis. belum ada sambutan atau foto prestasi) otomatis tidak tampil meski diaktifkan di sini.
        </p>
        <ReorderableToggleList
          items={blocks}
          onToggle={(key) => setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, aktif: !b.aktif } : b)))}
          onMove={(i, dir) => setBlocks((prev) => move(prev, i, dir))}
        />
      </section>

      <section className="mb-8">
        <h2 className="font-display font-bold mb-1">Item dalam "Jelajahi Website"</h2>
        <p className="text-xs text-ink/70 mb-3">
          Atur urutan dan tampil/sembunyikan kartu tautan di dalam bagian "Jelajahi Website".
        </p>
        <ReorderableToggleList
          compact
          items={sections}
          onToggle={(key) => setSections((prev) => prev.map((s) => (s.key === key ? { ...s, aktif: !s.aktif } : s)))}
          onMove={(i, dir) => setSections((prev) => move(prev, i, dir))}
        />
      </section>

      <div className="flex items-center gap-3">
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
