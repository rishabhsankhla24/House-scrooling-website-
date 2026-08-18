import React from 'react'

export function ArrowIcon({ direction = 'right' }) {
  const rotate = direction === 'down' ? 'rotate(90 12 12)' : undefined

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M14 6l6 6-6 6" transform={rotate} />
    </svg>
  )
}

export function PlayIcon({ paused = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paused ? (
        <path d="M8 6v12M16 6v12" />
      ) : (
        <path className="play-fill" d="m9 7 8 5-8 5Z" />
      )}
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function MenuIcon({ open = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
    </svg>
  )
}
