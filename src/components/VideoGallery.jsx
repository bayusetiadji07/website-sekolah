import { useState } from 'react'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Extract YouTube video ID from various URL formats
export function getYouTubeVideoId(url) {
  if (!url) return null

  // Handle youtube.com/watch?v=xxx
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]

  // Handle youtube.com/embed/xxx
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]

  // Handle youtube.com/v/xxx
  const vMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/)
  if (vMatch) return vMatch[1]

  // Handle youtube.com/shorts/xxx
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]

  return null
}

export function getYouTubeThumbnail(videoId) {
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
}

// Single video card with thumbnail
export function VideoCard({ video, onClick, className = '' }) {
  const videoId = getYouTubeVideoId(video.video_url)
  const thumbnail = getYouTubeThumbnail(videoId)

  if (!videoId) return null

  return (
    <button
      onClick={() => onClick?.(video)}
      className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 group cursor-pointer ${className}`}
    >
      <img
        src={thumbnail}
        alt={video.judul}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white text-sm font-medium line-clamp-1">{video.judul}</p>
      </div>
    </button>
  )
}

// Video modal player
export function VideoModal({ video, onClose }) {
  if (!video) return null

  const videoId = getYouTubeVideoId(video.video_url)
  const embedUrl = getYouTubeEmbedUrl(videoId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal content */}
      <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h3 className="text-white font-medium line-clamp-1 pr-4">{video.judul}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video container */}
        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={video.judul}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Description */}
        {video.deskripsi && (
          <div className="p-4 bg-gray-900">
            <p className="text-white/80 text-sm leading-relaxed">{video.deskripsi}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Video grid with modal player
export default function VideoGallery({ videos, title, className = '' }) {
  const [selectedVideo, setSelectedVideo] = useState(null)

  if (!videos || videos.length === 0) return null

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={setSelectedVideo}
          />
        ))}
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  )
}
