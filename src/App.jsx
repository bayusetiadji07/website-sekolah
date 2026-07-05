import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import Pengumuman from './pages/public/Pengumuman'
import Berita from './pages/public/Berita'
import Materi from './pages/public/Materi'
import Aplikasi from './pages/public/Aplikasi'
import Login from './pages/Login'

import AdminDashboard from './pages/admin/Dashboard'
import KelolaPengumuman from './pages/admin/KelolaPengumuman'
import KelolaBerita from './pages/admin/KelolaBerita'
import KelolaAplikasi from './pages/admin/KelolaAplikasi'
import KelolaUser from './pages/admin/KelolaUser'
import KelolaMateriAdmin from './pages/admin/KelolaMateri'

import KelolaMateriGuru from './pages/guru/KelolaMateri'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/pengumuman" element={<PublicLayout><Pengumuman /></PublicLayout>} />
      <Route path="/berita" element={<PublicLayout><Berita /></PublicLayout>} />
      <Route path="/materi" element={<PublicLayout><Materi /></PublicLayout>} />
      <Route path="/aplikasi" element={<PublicLayout><Aplikasi /></PublicLayout>} />
      <Route path="/masuk" element={<PublicLayout><Login /></PublicLayout>} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pengumuman" element={<ProtectedRoute allowedRoles={['admin']}><KelolaPengumuman /></ProtectedRoute>} />
      <Route path="/admin/berita" element={<ProtectedRoute allowedRoles={['admin']}><KelolaBerita /></ProtectedRoute>} />
      <Route path="/admin/materi" element={<ProtectedRoute allowedRoles={['admin']}><KelolaMateriAdmin /></ProtectedRoute>} />
      <Route path="/admin/aplikasi" element={<ProtectedRoute allowedRoles={['admin']}><KelolaAplikasi /></ProtectedRoute>} />
      <Route path="/admin/pengguna" element={<ProtectedRoute allowedRoles={['admin']}><KelolaUser /></ProtectedRoute>} />

      <Route path="/guru" element={<ProtectedRoute allowedRoles={['guru']}><KelolaMateriGuru /></ProtectedRoute>} />
    </Routes>
  )
}
