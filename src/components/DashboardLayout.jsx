import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ links, title, children }) {
  const location = useLocation()
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-56 glass-dark text-paper flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-paper/10">
          <p className="font-display font-bold text-amber">{title}</p>
          <p className="text-xs text-paper/60 mt-1">{profile?.nama || profile?.role}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-3 py-2 rounded text-sm ${
                location.pathname === l.to
                  ? 'bg-amber text-chalkboard font-medium'
                  : 'text-paper/85 hover:bg-paper/10'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        {/* Tombol keluar selalu terlihat, tidak digabung ke menu lain */}
        <button
          onClick={signOut}
          className="mx-3 mb-4 px-3 py-2 rounded text-sm text-left border border-paper/20 hover:bg-rust hover:border-rust transition-colors"
        >
          Keluar
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex justify-between items-center glass-dark text-paper px-4 py-3">
          <span className="font-display font-bold text-amber">{title}</span>
          <button
            onClick={signOut}
            className="text-sm border border-paper/30 px-3 py-1 rounded"
          >
            Keluar
          </button>
        </div>
        <div key={location.pathname} className="p-6 max-w-4xl page-transition">{children}</div>
      </main>
    </div>
  )
}
