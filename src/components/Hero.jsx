import React, { useEffect, useRef, useState } from 'react'
import { ArrowIcon } from './Icons.jsx'

const SCRUB_FPS = 24
const SCRUB_FRAME_COUNT = 240

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value))
const formatFrame = (frame) => String(frame + 1).padStart(3, '0')

function shouldEnableScrub() {
  if (typeof window === 'undefined') return true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = navigator.connection?.saveData === true
  return !reducedMotion && !saveData
}

export default function Hero() {
  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const copyRef = useRef(null)
  const cueRef = useRef(null)
  const frameNumberRef = useRef(null)
  const [scrubEnabled, setScrubEnabled] = useState(shouldEnableScrub)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = navigator.connection
    const updatePreference = () => setScrubEnabled(shouldEnableScrub())

    motionQuery.addEventListener?.('change', updatePreference)
    connection?.addEventListener?.('change', updatePreference)

    return () => {
      motionQuery.removeEventListener?.('change', updatePreference)
      connection?.removeEventListener?.('change', updatePreference)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const video = videoRef.current
    const copy = copyRef.current
    const cue = cueRef.current
    const frameNumber = frameNumberRef.current
    if (!track || !stage || !video || !copy || !cue || !frameNumber) return undefined

    if (!scrubEnabled) {
      stage.style.setProperty('--hero-progress', '0')
      stage.style.setProperty('--hero-copy-opacity', '1')
      stage.style.setProperty('--hero-copy-shift', '0rem')
      stage.style.setProperty('--hero-cue-opacity', '1')
      stage.style.setProperty('--hero-shade-opacity', '1')
      frameNumber.textContent = '001'
      return undefined
    }

    let animationFrame = 0
    let desiredFrame = 0
    let appliedFrame = -1
    let metadataReady = video.readyState >= HTMLMediaElement.HAVE_METADATA
    let disposed = false
    let copyHidden = false
    let cueHidden = false

    const setInteractionHidden = (element, hidden) => {
      const focusableElements = [
        ...(element.matches('a, button, input, select, textarea, [tabindex]') ? [element] : []),
        ...element.querySelectorAll('a, button, input, select, textarea, [tabindex]'),
      ]

      element.inert = hidden
      if (hidden) {
        element.setAttribute('aria-hidden', 'true')
        focusableElements.forEach((focusable) => {
          if (!focusable.hasAttribute('data-scrub-tabindex')) {
            focusable.dataset.scrubTabindex = focusable.getAttribute('tabindex') ?? ''
          }
          focusable.setAttribute('tabindex', '-1')
        })
      } else {
        element.removeAttribute('aria-hidden')
        focusableElements.forEach((focusable) => {
          if (!focusable.hasAttribute('data-scrub-tabindex')) return
          const previousTabIndex = focusable.dataset.scrubTabindex
          if (previousTabIndex) focusable.setAttribute('tabindex', previousTabIndex)
          else focusable.removeAttribute('tabindex')
          delete focusable.dataset.scrubTabindex
        })
      }
    }

    const getLastFrame = () => {
      if (!metadataReady || !Number.isFinite(video.duration)) return SCRUB_FRAME_COUNT - 1
      return Math.min(SCRUB_FRAME_COUNT - 1, Math.max(0, Math.floor(video.duration * SCRUB_FPS) - 1))
    }

    const applyDesiredFrame = () => {
      if (disposed || !metadataReady || video.seeking || desiredFrame === appliedFrame) return
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      appliedFrame = desiredFrame
      const frameTime = (desiredFrame + 0.001) / SCRUB_FPS
      try {
        video.currentTime = Math.min(frameTime, Math.max(0, video.duration - 0.001))
      } catch {
        appliedFrame = -1
      }
    }

    const renderScrub = () => {
      animationFrame = 0
      const scrollTravel = Math.max(1, track.offsetHeight - stage.offsetHeight)
      const progress = clamp(-track.getBoundingClientRect().top / scrollTravel)
      const copyFade = clamp((progress - 0.46) / 0.24)
      const cueFade = clamp(progress / 0.16)
      const lastFrame = getLastFrame()

      if ((copyFade >= 0.99) !== copyHidden) {
        copyHidden = !copyHidden
        setInteractionHidden(copy, copyHidden)
      }
      if ((cueFade >= 0.99) !== cueHidden) {
        cueHidden = !cueHidden
        setInteractionHidden(cue, cueHidden)
      }

      desiredFrame = Math.round(progress * lastFrame)
      frameNumber.textContent = formatFrame(desiredFrame)

      stage.style.setProperty('--hero-progress', progress.toFixed(5))
      stage.style.setProperty('--hero-copy-opacity', (1 - copyFade).toFixed(4))
      stage.style.setProperty('--hero-copy-shift', `${(copyFade * 1.2).toFixed(3)}rem`)
      stage.style.setProperty('--hero-cue-opacity', (1 - cueFade).toFixed(4))
      stage.style.setProperty('--hero-shade-opacity', (1 - progress * 0.42).toFixed(4))

      applyDesiredFrame()
    }

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderScrub)
    }

    const handleMetadata = () => {
      metadataReady = true
      video.pause()
      requestRender()
    }

    const handleSeeked = () => {
      if (desiredFrame !== appliedFrame) requestRender()
    }

    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender, { passive: true })
    video.addEventListener('loadedmetadata', handleMetadata)
    video.addEventListener('durationchange', handleMetadata)
    video.addEventListener('seeked', handleSeeked)
    requestRender()

    return () => {
      disposed = true
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      video.removeEventListener('loadedmetadata', handleMetadata)
      video.removeEventListener('durationchange', handleMetadata)
      video.removeEventListener('seeked', handleSeeked)
      setInteractionHidden(copy, false)
      setInteractionHidden(cue, false)
    }
  }, [scrubEnabled])

  return (
    <section
      ref={trackRef}
      className={`hero${scrubEnabled ? '' : ' is-static'}`}
      id="top"
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          src={scrubEnabled ? '/media/alba-residence-scrub.mp4' : undefined}
          poster="/media/exterior.png"
          muted
          playsInline
          preload={scrubEnabled ? 'auto' : 'none'}
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setScrubEnabled(false)}
        />
        <div className="hero-shade" aria-hidden="true" />

        <div ref={copyRef} className="hero-copy">
          <h1 id="hero-title">A home shaped<br />by light.</h1>
          <p>A private modern residence where architecture, landscape, and calm move as one.</p>
          <a className="outline-button hero-cta" href="#residence">
            Explore the residence
            <ArrowIcon direction="down" />
          </a>
        </div>

        <a
          ref={cueRef}
          className="scroll-cue"
          href="#residence"
          aria-label="Skip to the residence story"
        >
          <span className="scroll-rail" aria-hidden="true">
            <span className="scroll-progress" />
          </span>
          <small>Scroll</small>
        </a>

        <div className="scrub-readout" aria-hidden="true">
          <span>Frame</span>
          <strong ref={frameNumberRef}>001</strong>
          <span>/ 240</span>
        </div>
      </div>
    </section>
  )
}
