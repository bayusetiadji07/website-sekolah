import { Link } from 'react-router-dom'
import { tentangKamiTabs } from '../../components/TentangKamiTabs'

const descriptions = {
  '/profil/sejarah': 'Kisah perjalanan berdirinya sekolah',
  '/profil/sambutan': 'Kata sambutan dari kepala sekolah',
  '/profil/visi-misi': 'Arah dan tujuan pendidikan sekolah',
  '/profil/tenaga-pendidik': 'Profil guru dan tenaga kependidikan',
  '/profil/fasilitas': 'Sarana dan prasarana penunjang belajar',
  '/profil/kemitraan': 'Mitra kerja sama sekolah',
}

export default function Profil() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Tentang Kami</h1>
      <div className="chalk-divider w-24 mb-8" />
      <p className="text-ink/70 mb-8 max-w-2xl">
        Kenali lebih dekat SMP Negeri 3 Besuki — sejarah, visi misi, tenaga pendidik, fasilitas, hingga kemitraan sekolah.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {tentangKamiTabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="glass shadow-sm rounded-lg p-5 hover:border-amber hover:shadow-md transition-all"
          >
            <h3 className="font-display font-bold text-lg mb-1">{t.label}</h3>
            <p className="text-sm text-ink/60">{descriptions[t.to]}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
