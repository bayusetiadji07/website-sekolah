import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { KATEGORI_KUNJUNGAN, kompresFoto, fmtUkuran, fmtJam } from '../../lib/bukuTamu'
import { Camera, CheckCircle, Loader2, LogIn, Trash2 } from 'lucide-react'
import logoBukuTamu from '../../assets/logo-buku-tamu.png'

const empty = {
  nama: '',
  no_hp: '',
  instansi: '',
  kategori: '',
  bertemu_dengan: '',
  tujuan: '',
}

export default function BukuTamu() {
  const fotoInputRef = useRef(null)
  const [form, setForm] = useState(empty)
  const [stafList, setStafList] = useState([])
  const [foto, setFoto] = useState(null)
  const [kompresi, setKompresi] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sukses, setSukses] = useState(null)

  useEffect(() => {
    supabase
      .from('tenaga_pendidik')
      .select('nama, jabatan')
      .eq('aktif', true)
      .order('urutan')
      .order('nama')
      .then(({ data }) => setStafList(data || []))
  }, [])

  async function handleFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Berkas yang dipilih harus berupa gambar.')
      e.target.value = ''
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Ukuran foto maksimal 8MB.')
      e.target.value = ''
      return
    }
    setError('')
    setKompresi(true)
    try {
      setFoto(await kompresFoto(file))
    } catch {
      setError('Gagal memproses foto. Silakan coba lagi.')
    }
    setKompresi(false)
  }

  function hapusFoto() {
    setFoto(null)
    if (fotoInputRef.current) fotoInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!/^(\+62|0)[\d\-\s]{8,15}$/.test(form.no_hp.trim())) {
      setError('Format nomor HP tidak valid. Contoh: 081234567890')
      return
    }

    setSending(true)
    const checkInTime = new Date().toISOString()
    const { error: insertError } = await supabase.from('bt_visitors').insert({
      nama: form.nama.trim(),
      no_hp: form.no_hp.trim(),
      instansi: form.instansi.trim(),
      kategori: form.kategori,
      tujuan: form.tujuan.trim(),
      bertemu_dengan: form.bertemu_dengan.trim(),
      foto_base64: foto?.dataUrl || null,
      check_in_time: checkInTime,
    })
    setSending(false)

    if (insertError) {
      setError('Gagal menyimpan data. Periksa koneksi internet lalu coba lagi.')
      return
    }

    setSukses({ nama: form.nama.trim(), jam: fmtJam(checkInTime) })
    setForm(empty)
    hapusFoto()
  }

  const inputClass =
    'w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-white/60">Buku Tamu</span>
          </div>
          <h1>Buku Tamu Digital</h1>
          <p>Catat kunjungan Anda ke SMP Negeri 3 Besuki secara online</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12">
        {sukses ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">Check-in berhasil</h2>
            <p className="text-ink-light mb-1">
              Selamat datang, <span className="font-semibold text-ink">{sukses.nama}</span>
            </p>
            <p className="text-sm text-ink-light mb-6">Tercatat pukul {sukses.jam} WIB</p>
            <p className="text-sm text-ink-light bg-primary/5 rounded-xl px-4 py-3 mb-6">
              Silakan menuju ruang tamu atau temui staf Tata Usaha untuk pengarahan selanjutnya.
            </p>
            <button onClick={() => setSukses(null)} className="btn btn-ghost">
              Check-in Tamu Lain
            </button>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <img
                  src={logoBukuTamu}
                  alt="Logo Buku Tamu Digital"
                  className="w-14 h-14 rounded-xl bg-white object-contain p-1 shrink-0"
                />
                <div>
                  <h2 className="font-display font-bold text-base mb-1">Isi Data Kunjungan</h2>
                  <p className="text-sm text-ink-light">
                    Lengkapi formulir berikut sebelum masuk ke lingkungan sekolah — tidak perlu login.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Nama Lengkap <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="Nama sesuai identitas"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Nomor HP / WhatsApp <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={form.no_hp}
                    onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Instansi / Asal <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dinas Pendidikan"
                    value={form.instansi}
                    onChange={(e) => setForm({ ...form, instansi: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Kategori Kunjungan <span className="text-secondary">*</span>
                  </label>
                  <select
                    required
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Pilih kategori</option>
                    {KATEGORI_KUNJUNGAN.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Bertemu Dengan <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="daftar-staf"
                    autoComplete="off"
                    placeholder="Nama guru/staf yang dituju"
                    value={form.bertemu_dengan}
                    onChange={(e) => setForm({ ...form, bertemu_dengan: e.target.value })}
                    className={inputClass}
                  />
                  <datalist id="daftar-staf">
                    {stafList.map((s) => (
                      <option key={s.nama} value={s.nama}>{s.jabatan || ''}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Tujuan / Keperluan <span className="text-secondary">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan keperluan kunjungan Anda..."
                  value={form.tujuan}
                  onChange={(e) => setForm({ ...form, tujuan: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Foto (opsional)</label>
                {foto ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={foto.dataUrl}
                      alt="Pratinjau foto tamu"
                      className="w-20 h-20 object-cover rounded-xl border border-ink/10"
                    />
                    <div className="text-sm">
                      <p className="text-ink font-medium">{fmtUkuran(foto.ukuranAkhirBytes)}</p>
                      <p className="text-xs text-ink-light">
                        dikompres otomatis dari {fmtUkuran(foto.ukuranAsliBytes)}
                      </p>
                      <button
                        type="button"
                        onClick={hapusFoto}
                        className="text-xs text-secondary font-medium mt-1 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-ink/15 rounded-xl py-4 text-sm text-ink-light cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    {kompresi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengompres foto...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Ambil / Unggah Foto
                      </>
                    )}
                    <input
                      ref={fotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFoto}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-ink-light mt-1.5">
                  Bisa langsung memakai kamera HP Anda. Foto otomatis dikompres agar hemat kuota.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending || kompresi}
                className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Check-in Sekarang
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
