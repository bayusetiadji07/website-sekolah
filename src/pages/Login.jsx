import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await signIn(email, password)
    if (signInError) {
      setError('Email atau kata sandi salah.')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    setLoading(false)
    if (profile?.role === 'admin') navigate('/admin')
    else if (profile?.role === 'guru') navigate('/guru')
    else setError('Akun ini belum memiliki akses. Hubungi admin.')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl font-bold mb-1">Masuk</h1>
        <p className="text-sm text-ink/60 mb-6">Untuk admin dan guru sekolah</p>

        {error && (
          <p className="text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/20 rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm font-medium mb-1">Kata Sandi</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/20 rounded px-3 py-2 mb-6 text-sm"
        />

        <button
          disabled={loading}
          className="w-full bg-chalkboard text-paper py-2.5 rounded font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
