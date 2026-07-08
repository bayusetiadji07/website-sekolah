import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'

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
        </div>
      ))}

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
