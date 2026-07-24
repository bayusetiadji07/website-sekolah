import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { JENIS_SURAT } from '../../../lib/sipas'
import { Send, CheckCircle, IdCard, ArrowRight } from 'lucide-react'

const empty = { kelas_id: '', siswa_id: '', jenis_surat: '', keperluan: '', tanggal_butuh: '', no_telepon: '', tempat_tanggal_lahir: '' }

export default function AjukanSurat() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [kelasList, setKelasList] = useState([])
  const [siswaList, setSiswaList] = useState([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [noTiket, setNoTiket] = useState('')

  useEffect(() => {
    supabase.rpc('sipas_daftar_kelas').then(({ data }) => setKelasList(data || []))
  }, [])

  async function handleKelasChange(kelasId) {
    setForm({ ...form, kelas_id: kelasId, siswa_id: '' })
    setSiswaList([])
    if (!kelasId) return
    const { data } = await supabase.rpc('sipas_daftar_siswa', { p_kelas_id: kelasId })
    setSiswaList(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')

    const { data: generatedNoTiket, error: rpcError } = await supabase.rpc('sipas_ajukan_surat', {
      p_siswa_id: form.siswa_id,
      p_jenis_surat: form.jenis_surat,
      p_keperluan: form.keperluan,
      p_tanggal_butuh: form.tanggal_butuh || null,
      p_no_telepon: form.no_telepon.trim(),
      p_tempat_tanggal_lahir: form.tempat_tanggal_lahir.trim(),
    })

    setSending(false)
    if (rpcError) {
      setError('Gagal mengirim pengajuan. Silakan coba lagi.')
      return
    }
    setForm(empty)
    setSiswaList([])
    setNoTiket(generatedNoTiket)
  }

  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/sipas" className="hover:text-white">SIPAS</Link>
            <span>/</span>
            <span className="text-white/60">Ajukan Surat</span>
          </div>
          <h1>Ajukan Surat</h1>
          <p>Isi formulir di bawah ini untuk mengajukan surat keterangan</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-12">
        {noTiket ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2">Pengajuan Terkirim!</h2>
            <p className="text-ink-light mb-4">Simpan nomor tiket Anda untuk mengecek status pengajuan.</p>
            <p className="font-mono text-xl font-bold bg-primary/5 text-primary rounded-xl py-3 px-4 mb-6 inline-block">
              {noTiket}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate(`/sipas/status/${noTiket}`)} className="btn btn-primary">
                Cek Status Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setNoTiket('')} className="btn btn-ghost">
                Ajukan Surat Lain
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <IdCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base mb-1">Pilih Identitas Anda</h2>
                  <p className="text-sm text-ink-light">
                    Pilih kelas lalu nama Anda dari data siswa sekolah — tidak perlu login.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Kelas <span className="text-secondary">*</span>
                  </label>
                  <select
                    required
                    value={form.kelas_id}
                    onChange={(e) => handleKelasChange(e.target.value)}
                    className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Pilih kelas</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Nama Siswa <span className="text-secondary">*</span>
                  </label>
                  <select
                    required
                    disabled={!form.kelas_id}
                    value={form.siswa_id}
                    onChange={(e) => setForm({ ...form, siswa_id: e.target.value })}
                    className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  >
                    <option value="">{form.kelas_id ? 'Pilih nama' : 'Pilih kelas dulu'}</option>
                    {siswaList.map((s) => (
                      <option key={s.id} value={s.id}>{s.nama_siswa}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Jenis Surat <span className="text-secondary">*</span>
                </label>
                <select
                  required
                  value={form.jenis_surat}
                  onChange={(e) => setForm({ ...form, jenis_surat: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="">Pilih jenis surat</option>
                  {JENIS_SURAT.map((j) => (
                    <option key={j.value} value={j.value}>{j.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Nomor Telepon / WhatsApp <span className="text-secondary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={form.no_telepon}
                  onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-ink-light mt-1">Dipakai staf TU untuk menghubungi Anda bila diperlukan.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Tempat, Tanggal Lahir <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Situbondo, 12 Januari 2012"
                  value={form.tempat_tanggal_lahir}
                  onChange={(e) => setForm({ ...form, tempat_tanggal_lahir: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Keperluan <span className="text-secondary">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan keperluan Anda mengajukan surat ini..."
                  value={form.keperluan}
                  onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Tanggal Dibutuhkan (opsional)
                </label>
                <input
                  type="date"
                  value={form.tanggal_butuh}
                  onChange={(e) => setForm({ ...form, tanggal_butuh: e.target.value })}
                  className="w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pengajuan
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
