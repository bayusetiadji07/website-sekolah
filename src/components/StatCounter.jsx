import { useEffect, useRef, useState } from 'react'
import { Users, BookOpen, Trophy, Handshake, UserCog } from 'lucide-react'

const iconMap = {
  'Guru': Users,
  'Tenaga Pendidik': Users,
  'Tenaga Kependidikan': UserCog,
  'Fasilitas': BookOpen,
  'Prestasi': Trophy,
  'Mitra Sekolah': Handshake,
  'Mitra': Handshake,
}

export default function StatCounter({ value, label, duration = 1500 }) {
  const [display, setDisplay] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  // Deteksi elemen masuk ke layar — cukup sekali saja.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Jalankan animasi setiap kali `value` berubah (mis. saat data selesai dimuat),
  // selama elemen sudah pernah terlihat di layar.
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, visible, duration])

  const Icon = iconMap[label] || BookOpen

  return (
    <div ref={ref} className="text-center group px-1">
      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 sm:mb-2 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 sm:mb-1">
        {display}
        <span className="text-secondary">+</span>
      </p>
      <p className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight">{label}</p>
    </div>
  )
} 
