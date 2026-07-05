import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import Profil from './pages/public/Profil'
import Sejarah from './pages/public/profil/Sejarah'
import Sambutan from './pages/public/profil/Sambutan'
import VisiMisi from './pages/public/profil/VisiMisi'
import TenagaPendidik from './pages/public/profil/TenagaPendidik'
import Fasilitas from './pages/public/profil/Fasilitas'
import Kemitraan from './pages/public/profil/Kemitraan'
import Pengumuman from './pages/public/Pengumuman'
import Berita from './pages/public/Berita'
import Agenda from './pages/public/Agenda'
import Galeri from './pages/public/Galeri'
import Materi from './pages/public/Materi'
import Aplikasi from './pages/public/Aplikasi'
import Kontak from './pages/public/Kontak'
import Login from './pages/Login'

import AdminDashboard from './pages/admin/Dashboard'
import KelolaProfil from './pages/admin/KelolaProfil'
import KelolaTampilan from './pages/admin/KelolaTampilan'
import KelolaTenagaPendidik from './pages/admin/KelolaTenagaPendidik'
import KelolaFasilitas from './pages/admin/KelolaFasilitas'
import KelolaKemitraan from './pages/admin/KelolaKemitraan'
import KelolaPengumuman from './pages/admin/KelolaPengumuman'
import KelolaBerita from './pages/admin/KelolaBerita'
import KelolaAgenda from './pages/admin/KelolaAgenda'
import KelolaGaleri from './pages/admin/KelolaGaleri'
import KelolaAplikasi from './pages/admin/KelolaAplikasi'
import KelolaUser from './pages/admin/KelolaUser'
import KelolaMateriAdmin from './pages/admin/KelolaMateri'

import KelolaMateriGuru from './pages/guru/KelolaMateri'

function PublicLayout({ children }) {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main key={location.pathname} className="flex-1 page-transition">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/profil" element={<PublicLayout><Profil /></PublicLayout>} />
      <Route path="/profil/sejarah" element={<PublicLayout><Sejarah /></PublicLayout>} />
      <Route path="/profil/sambutan" element={<PublicLayout><Sambutan /></PublicLayout>} />
      <Route path="/profil/visi-misi" element={<PublicLayout><VisiMisi /></PublicLayout>} />
      <Route path="/profil/tenaga-pendidik" element={<PublicLayout><TenagaPendidik /></PublicLayout>} />
      <Route path="/profil/fasilitas" element={<PublicLayout><Fasilitas /></PublicLayout>} />
      <Route path="/profil/kemitraan" element={<PublicLayout><Kemitraan /></PublicLayout>} />
      <Route path="/pengumuman" element={<PublicLayout><Pengumuman /></PublicLayout>} />
      <Route path="/berita" element={<PublicLayout><Berita /></PublicLayout>} />
      <Route path="/agenda" element={<PublicLayout><Agenda /></PublicLayout>} />
      <Route path="/galeri" element={<PublicLayout><Galeri /></PublicLayout>} />
      <Route path="/materi" element={<PublicLayout><Materi /></PublicLayout>} />
      <Route path="/aplikasi" element={<PublicLayout><Aplikasi /></PublicLayout>} />
      <Route path="/kontak" element={<PublicLayout><Kontak /></PublicLayout>} />
      <Route path="/masuk" element={<PublicLayout><Login /></PublicLayout>} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/profil" element={<ProtectedRoute allowedRoles={['admin']}><KelolaProfil /></ProtectedRoute>} />
      <Route path="/admin/tampilan" element={<ProtectedRoute allowedRoles={['admin']}><KelolaTampilan /></ProtectedRoute>} />
      <Route path="/admin/tenaga-pendidik" element={<ProtectedRoute allowedRoles={['admin']}><KelolaTenagaPendidik /></ProtectedRoute>} />
      <Route path="/admin/fasilitas" element={<ProtectedRoute allowedRoles={['admin']}><KelolaFasilitas /></ProtectedRoute>} />
      <Route path="/admin/kemitraan" element={<ProtectedRoute allowedRoles={['admin']}><KelolaKemitraan /></ProtectedRoute>} />
      <Route path="/admin/pengumuman" element={<ProtectedRoute allowedRoles={['admin']}><KelolaPengumuman /></ProtectedRoute>} />
      <Route path="/admin/berita" element={<ProtectedRoute allowedRoles={['admin']}><KelolaBerita /></ProtectedRoute>} />
      <Route path="/admin/agenda" element={<ProtectedRoute allowedRoles={['admin']}><KelolaAgenda /></ProtectedRoute>} />
      <Route path="/admin/galeri" element={<ProtectedRoute allowedRoles={['admin']}><KelolaGaleri /></ProtectedRoute>} />
      <Route path="/admin/materi" element={<ProtectedRoute allowedRoles={['admin']}><KelolaMateriAdmin /></ProtectedRoute>} />
      <Route path="/admin/aplikasi" element={<ProtectedRoute allowedRoles={['admin']}><KelolaAplikasi /></ProtectedRoute>} />
      <Route path="/admin/pengguna" element={<ProtectedRoute allowedRoles={['admin']}><KelolaUser /></ProtectedRoute>} />

      <Route path="/guru" element={<ProtectedRoute allowedRoles={['guru']}><KelolaMateriGuru /></ProtectedRoute>} />
    </Routes>
  )
}
