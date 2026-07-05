import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-center text-ink/60">Memuat...</div>
  }

  if (!user || !profile) {
    return <Navigate to="/masuk" replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/masuk" replace />
  }

  return children
}
