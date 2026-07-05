export default function Footer() {
  return (
    <footer className="bg-chalkboard text-paper/70 mt-16">
      <div className="max-w-6xl mx-auto px-5 py-8 text-sm flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Nama Sekolah. Semua hak cipta dilindungi.</p>
        <p>Dikelola oleh admin & guru sekolah.</p>
      </div>
    </footer>
  )
}
