import React, { useRef, useState } from 'react'
import { PlayIcon } from './Icons.jsx'

const galleryItems = [
  { src: '/media/exterior.png', alt: 'Rear exterior of the modern residence', className: 'gallery-exterior' },
  { src: '/media/pool-wide.png', alt: 'Pool and timber-clad façade', className: 'gallery-pool' },
  { src: '/media/staircase.png', alt: 'Floating timber staircase with glass balustrade', className: 'gallery-stair' },
  { src: '/media/living.png', alt: 'Light-filled open living room', className: 'gallery-living' },
  { src: '/media/bedroom.png', alt: 'Bedroom with floor-to-ceiling corner windows', className: 'gallery-bedroom' },
]

export function StorySection() {
  return (
    <section className="story section-shell" id="residence">
      <div className="story-media" data-reveal>
        <img src="/media/pool-wide.png" alt="Pool overlooking the modern residence" />
      </div>
      <div className="story-copy" data-reveal>
        <span className="section-number" aria-hidden="true">01</span>
        <h2>Light, line,<br />and stillness.</h2>
        <p>Open spaces frame the sky, while warm timber and stone bring the landscape inside.</p>
      </div>
    </section>
  )
}

export function GallerySection() {
  return (
    <section className="gallery-section section-shell" id="spaces" aria-labelledby="spaces-title">
      <div className="section-heading" data-reveal>
        <h2 id="spaces-title">Spaces that breathe.</h2>
        <span />
      </div>
      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <figure className={item.className} key={item.src} data-reveal style={{ '--delay': `${index * 55}ms` }}>
            <img src={item.src} alt={item.alt} loading={index > 1 ? 'lazy' : 'eager'} />
          </figure>
        ))}
      </div>
    </section>
  )
}

export function FilmSection() {
  const filmRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggleFilm = async () => {
    const video = filmRef.current
    if (!video) return
    if (video.paused) {
      video.muted = false
      try {
        await video.play()
      } catch {
        video.muted = true
        await video.play()
      }
    } else {
      video.pause()
    }
  }

  const resetFilm = () => {
    const video = filmRef.current
    if (!video) return
    video.currentTime = 0
    setPlaying(false)
  }

  return (
    <section className={`film-section ${playing ? 'is-playing' : ''}`} id="film" aria-labelledby="film-title">
      <video
        ref={filmRef}
        className="film-video"
        src="/media/alba-residence.mp4"
        poster="/media/pool-entry.png"
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={resetFilm}
      />
      <div className="film-shade" aria-hidden="true" />
      <div className="film-content" data-reveal>
        <h2 id="film-title">See the residence in motion.</h2>
        <button
          className="film-control media-control"
          type="button"
          onClick={toggleFilm}
          aria-label={playing ? 'Pause residence film' : 'Play residence film'}
        >
          <PlayIcon paused={playing} />
        </button>
      </div>
    </section>
  )
}
