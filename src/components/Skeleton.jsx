export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBlock className="w-full aspect-video" />
      <div className="p-5 space-y-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3, cols = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid ${cols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="card p-4 flex items-center gap-4">
      <SkeletonBlock className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
      <SkeletonBlock className="h-9 w-20 rounded-xl" />
    </div>
  )
}

export function SkeletonRows({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  )
}
