import React, { useEffect, useState } from 'react'
import { MenuIcon } from './Icons.jsx'

const links = [
  ['Residence', '#residence'],
  ['Spaces', '#spaces'],
  ['Film', '#film'],
]

export default function SiteHeader({ onEnquire }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let animationFrame = 0
    let lastScrolled = null

    const updateHeader = () => {
      animationFrame = 0
      const hero = document.getElementById('top')
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 72
      const hasReachedPaper = hero
        ? hero.getBoundingClientRect().bottom <= headerHeight
        : window.scrollY > 32

      if (hasReachedPaper !== lastScrolled) {
        lastScrolled = hasReachedPaper
        setScrolled(hasReachedPaper)
      }
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateHeader)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
      <a className="wordmark" href="#top" aria-label="ALBA home" onClick={closeMenu}>
        ALBA
      </a>

      <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={closeMenu}>
            {label}
          </a>
        ))}
        <button
          className="nav-enquire"
          type="button"
          onClick={() => {
            closeMenu()
            onEnquire()
          }}
        >
          Enquire
        </button>
      </nav>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <MenuIcon open={menuOpen} />
      </button>
    </header>
  )
}
