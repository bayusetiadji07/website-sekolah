import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'
import { getYouTubeThumbnail, getYouTubeVideoId } from '../../components/VideoGallery'
import { Video, ExternalLink, Play } from 'lucide-react'

export default function KelolaVideo() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ judul: '', video_url: '', deskripsi: '', aktif: true, urutan: 0 })
  const [editingId, setEditingId] = useState(null)
  const [previewThumbnail, setPreviewThumbnail] = useState(null)

  async function load() {
    const { data } = await supabase.from('galeri_video').select('*').order('urutan').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  // Update thumbnail preview when URL changes
  useEffect(() => {
    if (form.video_url) {
      const videoId = getYouTubeVideoId(form.video_url)
      if (videoId) {
        setPreviewThumbnail(getYouTubeThumbnail(videoId))
      } else {
        setPreviewThumbnail(null)
      }
    } else {
      setPreviewThumbnail(null)
    }
  }, [form.video_url])

  async function handleSubmit(e) {
    e.preventDefault()
    const dataToSave = { ...form }

    // Generate thumbnail from YouTube URL if not provided
    if (form.video_url && !form.thumbnail_url) {
      const videoId = getYouTubeVideoId(form.video_url)
      if (videoId) {
        dataToSave.thumbnail_url = getYouTubeThumbnail(videoId)
      }
    }

    if (editingId) {
      await supabase.from('galeri_video').update(dataToSave).eq('id', editingId)
    } else {
      await supabase.from('galeri_video').insert(dataToSave)
    }
    setForm({ judul: '', video_url: '', deskripsi: '', aktif: true, urutan: 0 })
    setEditingId(null)
    setPreviewThumbnail(null)
    load()
  }

  async function toggleAktif(item) {
    await supabase.from('galeri_video').update({ aktif: !item.aktif }).eq('id', item.id)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus video ini?')) return
    await supabase.from('galeri_video').delete().eq('id', id)
    load()
  }

  function handleEdit(item) {
    setForm({
      judul: item.judul,
      video_url: item.video_url,
      deskripsi: item.deskripsi || '',
      aktif: item.aktif,
      urutan: item.urutan || 0,
    })
    setEditingId(item.id)
    const videoId = getYouTubeVideoId(item.video_url)
    if (videoId) {
      setPreviewThumbnail(getYouTubeThumbnail(videoId))
    }
  }

  function handleCancel() {
    setForm({ judul: '', video_url: '', deskripsi: '', aktif: true, urutan: 0 })
    setEditingId(null)
    setPreviewThumbnail(null)
  }

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Kelola Galeri Video</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-lg p-5 mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ink/70 mb-1">Judul Video *</label>
            <input
              placeholder="Contoh: Upacara Bendera Senin"
              required
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-ink/70 mb-1">Urutan Tampil</label>
            <input
              type="number"
              value={form.urutan}
              onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })}
              className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-ink/70 mb-1">Link YouTube *</label>
          <input
            placeholder="Tempelkan link YouTube (contoh: https://www.youtube.com/watch?v=xxxx)"
            required
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <p className="text-xs text-ink-light mt-1">
            Contoh: https://www.youtube.com/watch?v=abc123xyz atau https://youtu.be/abc123xyz
          </p>
        </div>

        {/* Preview Thumbnail */}
        {previewThumbnail && (
          <div className="border border-ink/10 rounded-lg p-3 bg-gray-50">
            <p className="text-xs text-ink/70 mb-2">Preview Thumbnail:</p>
            <div className="relative w-64 aspect-video rounded-lg overflow-hidden bg-black">
              <img src={previewThumbnail} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs text-ink/70 mb-1">Deskripsi (opsional)</label>
          <textarea
            placeholder="Deskripsi video..."
            rows={2}
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.aktif}
              onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
              className="w-4 h-4 rounded border-ink/20"
            />
            Tampilkan di website
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-chalkboard text-paper px-4 py-2 rounded text-sm font-medium">
            {editingId ? 'Simpan Perubahan' : 'Tambah Video'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="text-sm text-ink/70">
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Video List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg overflow-hidden">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black">
              {item.thumbnail_url || (getYouTubeVideoId(item.video_url) && getYouTubeThumbnail(getYouTubeVideoId(item.video_url))) ? (
                <img
                  src={item.thumbnail_url || getYouTubeThumbnail(getYouTubeVideoId(item.video_url))}
                  alt={item.judul}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Video className="w-12 h-12 text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
              <a
                href={item.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.aktif ? 'Aktif' : 'Nonaktif'}
                </span>
                {item.urutan > 0 && (
                  <span className="text-xs text-ink-light">#{item.urutan}</span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm line-clamp-1">{item.judul}</h3>
              {item.deskripsi && (
                <p className="text-xs text-ink-light line-clamp-2 mt-1">{item.deskripsi}</p>
              )}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-ink/5">
                <button
                  onClick={() => toggleAktif(item)}
                  className="text-xs text-primary hover:underline"
                >
                  {item.aktif ? 'Sembunyikan' : 'Tampilkan'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(item)} className="text-xs text-chalkboard underline">Ubah</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-rust underline">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-ink-light">
          <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada video. Tambahkan video YouTube di atas.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
