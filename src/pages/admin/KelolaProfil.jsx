import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { adminLinks } from './links'

const empty = {
  logo_url: '', tagline: '', sambutan_kepala_sekolah: '', nama_kepala_sekolah: '', foto_kepala_sekolah_url: '',
  visi: '', misi: '', sejarah: '', foto_sekolah_url: '',
  alamat: '', telepon: '', email: '', jam_operasional: '', maps_embed_url: '',
  instagram_url: '', facebook_url: '', youtube_url: '', tiktok_url: '',
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink/70 mb-1">{label}</span>
      {children}
    </label>
  )
}

export default function KelolaProfil() {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    supabase.from('pengaturan_sekolah').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setForm({ ...empty, ...data }) })
  }, [])

  async function handleUpload(e, field) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(field)
    const path = `profil/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('media').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setForm((f) => ({ ...f, [field]: data.publicUrl }))
    }
    setUploading('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('pengaturan_sekolah').update(form).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls = 'w-full border border-ink/20 rounded px-3 py-2 text-sm'

  return (
    <DashboardLayout links={adminLinks} title="Admin">
      <h1 className="font-display text-2xl font-bold mb-6">Profil & Kontak Sekolah</h1>
      <p className="text-sm text-ink/70 mb-4">Konten ini tampil di halaman publik "Profil" dan "Kontak".</p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-3">
          <h2 className="font-display font-bold">Umum</h2>
          <Field label="Logo sekolah (tampil di navigasi & footer)">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo_url')} className="text-sm" />
            {uploading === 'logo_url' && <p className="text-xs text-ink/70">Mengunggah...</p>}
            {form.logo_url && <img src={form.logo_url} className="h-16 mt-2 rounded bg-paper border border-ink/10 p-1" />}
          </Field>
          <Field label="Tagline / slogan sekolah">
            <input className={inputCls} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </Field>
          <Field label="Foto sekolah (untuk halaman profil)">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'foto_sekolah_url')} className="text-sm" />
            {uploading === 'foto_sekolah_url' && <p className="text-xs text-ink/70">Mengunggah...</p>}
            {form.foto_sekolah_url && <img src={form.foto_sekolah_url} className="h-20 mt-2 rounded" />}
          </Field>
        </section>

        <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-3">
          <h2 className="font-display font-bold">Sambutan Kepala Sekolah</h2>
          <Field label="Nama kepala sekolah">
            <input className={inputCls} value={form.nama_kepala_sekolah} onChange={(e) => setForm({ ...form, nama_kepala_sekolah: e.target.value })} />
          </Field>
          <Field label="Foto kepala sekolah">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'foto_kepala_sekolah_url')} className="text-sm" />
            {uploading === 'foto_kepala_sekolah_url' && <p className="text-xs text-ink/70">Mengunggah...</p>}
            {form.foto_kepala_sekolah_url && <img src={form.foto_kepala_sekolah_url} className="h-20 w-20 rounded-full object-cover mt-2" />}
          </Field>
          <Field label="Isi sambutan">
            <textarea rows={5} className={inputCls} value={form.sambutan_kepala_sekolah} onChange={(e) => setForm({ ...form, sambutan_kepala_sekolah: e.target.value })} />
          </Field>
        </section>

        <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-3">
          <h2 className="font-display font-bold">Visi, Misi & Sejarah</h2>
          <Field label="Visi">
            <textarea rows={2} className={inputCls} value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} />
          </Field>
          <Field label="Misi (satu poin per baris)">
            <textarea rows={5} className={inputCls} value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })} />
          </Field>
          <Field label="Sejarah singkat">
            <textarea rows={5} className={inputCls} value={form.sejarah} onChange={(e) => setForm({ ...form, sejarah: e.target.value })} />
          </Field>
        </section>

        <section className="bg-white border border-ink/10 rounded-lg p-5 space-y-3">
          <h2 className="font-display font-bold">Kontak</h2>
          <Field label="Alamat"><input className={inputCls} value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} /></Field>
          <Field label="Telepon"><input className={inputCls} value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Jam operasional"><input className={inputCls} placeholder="Senin - Sabtu, 07.00 - 14.00" value={form.jam_operasional} onChange={(e) => setForm({ ...form, jam_operasional: e.target.value })} /></Field>
          <Field label="Lokasi peta (ketik alamat sekolah, atau tempel link Google Maps)">
            <input className={inputCls} placeholder="Contoh: SMP Negeri 3 Besuki, Situbondo" value={form.maps_embed_url} onChange={(e) => setForm({ ...form, maps_embed_url: e.target.value })} />
            <p className="text-xs text-ink/70 mt-1">
              Paling mudah: ketik saja alamat/nama sekolah. Link "Bagikan" singkat dari Google Maps
              (maps.app.goo.gl/...) tidak bisa dibaca otomatis — kalau itu yang ditempel, peta akan
              otomatis memakai kolom Alamat di bawah sebagai gantinya. Kalau punya link "Sematkan peta"
              (embed) dari Google Maps, itu paling akurat dan bisa ditempel di sini.
            </p>
          </Field>
          <Field label="Instagram (URL)"><input className={inputCls} value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} /></Field>
          <Field label="Facebook (URL)"><input className={inputCls} value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} /></Field>
          <Field label="YouTube (URL)"><input className={inputCls} value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} /></Field>
          <Field label="TikTok (URL)"><input className={inputCls} value={form.tiktok_url} onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })} /></Field>
        </section>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="bg-chalkboard text-paper px-5 py-2.5 rounded text-sm font-medium disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {saved && <span className="text-sm text-rust">Tersimpan.</span>}
        </div>
      </form>
    </DashboardLayout>
  )
}
