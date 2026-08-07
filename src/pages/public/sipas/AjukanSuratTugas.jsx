import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { Send, CheckCircle, Briefcase, ArrowRight } from 'lucide-react'

const empty = {
  nama_guru: '',
  nip: '',
  pangkat_golongan: '',
  jabatan: '',
  unit_kerja: 'SMP Negeri 3 Besuki',
  dasar_surat_dari: '',
  dasar_surat_nomor: '',
  dasar_surat_tanggal: '',
  dasar_surat_perihal: '',
  hari_tanggal_tugas: '',
  tempat_tugas: '',
  no_telepon: '',
}

export default function AjukanSuratTugas() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [noTiket, setNoTiket] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')

    const { data: generatedNoTiket, error: rpcError } = await supabase.rpc('sipas_ajukan_surat_tugas', {
      p_nama_guru: form.nama_guru.trim(),
      p_nip: form.nip.trim(),
      p_pangkat_golongan: form.pangkat_golongan.trim(),
      p_jabatan: form.jabatan.trim(),
      p_unit_kerja: form.unit_kerja.trim(),
      p_dasar_surat_dari: form.dasar_surat_dari.trim(),
      p_dasar_surat_nomor: form.dasar_surat_nomor.trim(),
      p_dasar_surat_tanggal: form.dasar_surat_tanggal.trim(),
      p_dasar_surat_perihal: form.dasar_surat_perihal.trim(),
      p_hari_tanggal_tugas: form.hari_tanggal_tugas.trim(),
      p_tempat_tugas: form.tempat_tugas.trim(),
      p_no_telepon: form.no_telepon.trim(),
    })

    setSending(false)
    if (rpcError) {
      setError('Gagal mengirim pengajuan. Silakan coba lagi.')
      return
    }
    setForm(empty)
    setNoTiket(generatedNoTiket)
  }

  const inputCls = 'w-full border border-ink/15 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div>
      <div className="page-header rounded-b-2xl">
        <div className="max-w-6xl mx-auto px-5 page-header-content">
          <div className="breadcrumb">
            <Link to="/" className="hover:text-white">Beranda</Link>
            <span>/</span>
            <Link to="/sipas" className="hover:text-white">SIPAS</Link>
            <span>/</span>
            <span className="text-white/60">Ajukan Surat Tugas</span>
          </div>
          <h1>Ajukan Surat Tugas</h1>
          <p>Untuk guru dan tenaga kependidikan — isi formulir di bawah ini</p>
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
                Ajukan Surat Tugas Lain
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base mb-1">Data Penugasan</h2>
                  <p className="text-sm text-ink-light">
                    Isi nama Anda, lalu lengkapi data dasar penugasan sesuai surat/undangan yang diterima.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Nama Guru/Tendik <span className="text-secondary">*</span>
                </label>
                <input type="text" required value={form.nama_guru} onChange={(e) => setForm({ ...form, nama_guru: e.target.value })} className={inputCls} placeholder="Nama lengkap beserta gelar" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">NIP</label>
                  <input type="text" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} className={inputCls} placeholder="Isi jika ada" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Pangkat / Golongan</label>
                  <input type="text" value={form.pangkat_golongan} onChange={(e) => setForm({ ...form, pangkat_golongan: e.target.value })} className={inputCls} placeholder="Isi jika ada" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Jabatan</label>
                  <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Unit Kerja</label>
                  <input type="text" value={form.unit_kerja} onChange={(e) => setForm({ ...form, unit_kerja: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="pt-2 border-t border-ink/10">
                <p className="text-sm font-medium text-ink mb-3 pt-4">Dasar Surat Penugasan</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Dari <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.dasar_surat_dari} onChange={(e) => setForm({ ...form, dasar_surat_dari: e.target.value })} className={inputCls} placeholder="Contoh: Dinas Pendidikan dan Kebudayaan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Nomor Surat <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.dasar_surat_nomor} onChange={(e) => setForm({ ...form, dasar_surat_nomor: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Tanggal Surat <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.dasar_surat_tanggal} onChange={(e) => setForm({ ...form, dasar_surat_tanggal: e.target.value })} className={inputCls} placeholder="Contoh: 20 Juli 2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Perihal <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.dasar_surat_perihal} onChange={(e) => setForm({ ...form, dasar_surat_perihal: e.target.value })} className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-ink/10">
                <p className="text-sm font-medium text-ink mb-3 pt-4">Pelaksanaan Tugas</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Hari/Tanggal <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.hari_tanggal_tugas} onChange={(e) => setForm({ ...form, hari_tanggal_tugas: e.target.value })} className={inputCls} placeholder="Contoh: Senin, 28 Juli 2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      Tempat <span className="text-secondary">*</span>
                    </label>
                    <input type="text" required value={form.tempat_tugas} onChange={(e) => setForm({ ...form, tempat_tugas: e.target.value })} className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Nomor Telepon / WhatsApp <span className="text-secondary">*</span>
                </label>
                <input type="tel" required value={form.no_telepon} onChange={(e) => setForm({ ...form, no_telepon: e.target.value })} className={inputCls} placeholder="08xxxxxxxxxx" />
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
