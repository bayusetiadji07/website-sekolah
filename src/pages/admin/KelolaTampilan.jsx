import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import ReorderableToggleList from '../../components/ReorderableToggleList'

const defaultBlocks = [
  { key: 'statistik', label: 'Statistik Sekolah', aktif: true },
  { key: 'sambutan', label: 'Sambutan Kepala Sekolah', aktif: true },
  { key: 'tenaga_pendidik', label: 'Tenaga Pendidik & Kependidikan', aktif: true },
  { key: 'jelajahi', label: 'Jelajahi Website', aktif: true },
  { key: 'prestasi', label: 'Prestasi Sekolah', aktif: true },
  { key: 'berita', label: 'Berita & Kegiatan Terbaru', aktif: true },
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

// Gabungkan blok tersimpan di database dengan blok default terbaru,
// supaya blok baru (mis. "berita") tetap muncul walau pengaturan lama sudah pernah disimpan.
function mergeBlocks(saved, defaults) {
  const savedKeys = new Set(saved.map((b) => b.key))
  const missing = defaults.filter((b) => !savedKeys.has(b.key))
  return [...saved, ...missing]
}

function move(list, index, dir) {
  const next = [...list]
  const target = index + dir
  if (target < 0 || target >= next.length) return list
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function resizeImage(file, maxWidth = 1920, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality)
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

export default function KelolaTampilan() {
  const [blocks, setBlocks] = useState(defaultBlocks)
  const [sections, setSections] = useState(defaultSections)
  const [heroImages, setHeroImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('beranda_sections, beranda_blocks, hero_images, hero_image_url').eq('id', 1).single()
      .then(({ data }) => {
        if (data?.beranda_sections?.length) setSections(data.beranda_sections)
        if (data?.beranda_blocks?.length) setBlocks(mergeBlocks(data.beranda_blocks, defaultBlocks))
        if (data?.hero_images?.length) setHeroImages(data.hero_images)
        else if (data?.hero_image_url) setHeroImages([data.hero_image_url])
      })
  }, [])

  async function handleUploadHero(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const uploaded = []
    for (const file of files) {
      const resized = await resizeImage(file)
      const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
      const { error } = await supabase.storage.from('media').upload(path, resized, { contentType: 'image/jpeg' })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setHeroImages((prev) => [...prev, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  function removeHeroImage(index) {
    setHeroImages((prev) => prev.filter((_, i) => i !== index))
  }

  function moveHeroImage(index, dir) {
    setHeroImages((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('pengaturan_sekolah').update({
      beranda_sections: sections,
      beranda_blocks: blocks,
      hero_images: heroImages,
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
        <h2 className="font-display font-bold mb-1">Gambar Hero (Slideshow)</h2>
        <p className="text-xs text-ink/70 mb-3">
          Hero di paling atas Beranda kini tampil penuh gambar tanpa tulisan, bergantian otomatis tiap 5 detik.
          Unggah beberapa gambar sekaligus (bisa dipilih banyak file), atur urutan tayang dengan tombol ▲▼.
          Kalau kosong, latar polos warna navy yang dipakai.
        </p>
        <p className="text-xs text-ink/50 mb-3">
          Gambar otomatis diubah ukurannya dan dikompres saat diunggah, jadi tidak perlu diedit dulu. Untuk hasil
          terbaik gunakan foto landscape (mendatar) dengan subjek utama di tengah, karena tampilannya menyesuaikan
          bentuk layar (lebih tinggi di HP, lebih lebar di layar besar) sehingga bagian tepi bisa terpotong sedikit.
        </p>
        <input type="file" accept="image/*" multiple onChange={handleUploadHero} className="text-sm" />
        {uploading && <p className="text-xs text-ink/70 mt-1">Mengunggah...</p>}
        {heroImages.length > 0 && (
          <div className="mt-3 space-y-2">
            {heroImages.map((url, i) => (
              <div key={url + i} className="flex items-center gap-3 border border-ink/10 rounded-lg p-2">
                <img src={url} alt={`hero ${i + 1}`} className="w-24 h-14 object-cover rounded shrink-0" />
                <span className="text-xs text-ink/50 flex-1">Gambar {i + 1}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveHeroImage(i, -1)}
                    disabled={i === 0}
                    className="text-xs px-1.5 py-1 border border-ink/20 rounded disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveHeroImage(i, 1)}
                    disabled={i === heroImages.length - 1}
                    className="text-xs px-1.5 py-1 border border-ink/20 rounded disabled:opacity-30"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHeroImage(i)}
                    className="text-xs text-rust underline ml-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
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
