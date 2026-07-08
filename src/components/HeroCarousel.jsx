import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Users } from 'lucide-react'

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0)
  const slides = images?.length ? images : []
  const [direction, setDirection] = useState('next')

  useEffect(() => {
    if (slides.length <= 1) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const id = setInterval(() => {
      setDirection('next')
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const prev = () => {
    setDirection('prev')
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  const next = () => {
    setDirection('next')
    setIndex((i) => (i + 1) % slides.length)
  }

  if (!slides.length) {
    return (
      <section className="relative h-72 sm:h-80 md:h-[28rem] bg-gradient-to-br from-primary to-primary-light overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-50">Selamat Datang di SMP Negeri 3 Besuki</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-72 sm:h-80 md:h-[28rem] lg:h-[32rem] overflow-hidden">
      {/* Slides */}
      {slides.map((url, i) => (
        <div
          key={url + i}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            i === index
              ? 'opacity-100 scale-100'
              : direction === 'next'
              ? 'opacity-0 scale-105'
              : 'opacity-0 scale-95'
          }`}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${url}")` }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-6xl mx-auto px-5 sm:px-10 flex items-center">
        <div className="max-w-xl text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-4 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>SMP Negeri 3 Besuki</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 drop-shadow-sm">
            Mendidik dengan Hati,
            <br />
            <span className="text-secondary-light">Berprestasi dengan Karakter</span>
          </h1>
          <p className="text-white/85 text-base sm:text-lg mb-6 max-w-lg leading-relaxed">
            Membangun generasi penerus bangsa yang cerdas, berkarakter, dan berakhlak mulia melalui pendidikan berkualitas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/profil/sejarah" className="btn btn-secondary">
              Jelajahi Sekolah
            </Link>
            <Link to="/kontak" className="btn bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-3 flex items-center gap-6 sm:gap-10 text-white text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary-light" />
            <span>Tenaga Pendidik Profesional</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary-light" />
            <span>Berbagai Kegiatan Setiap Bulan</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary-light" />
            <span>Fasilitas Belajar Modern</span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Gambar sebelumnya"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Gambar berikutnya"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-14 right-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Gambar ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 'next' : 'prev')
                setIndex(i)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-8 bg-secondary'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 inset-x-0 chalk-divider" />
    </section>
  )
}
