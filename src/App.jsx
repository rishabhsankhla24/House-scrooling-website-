import React, { useCallback, useEffect, useState } from 'react'
import SiteHeader from './components/SiteHeader.jsx'
import Hero from './components/Hero.jsx'
import { FilmSection, GallerySection, StorySection } from './components/ResidenceSections.jsx'
import EnquiryModal from './components/EnquiryModal.jsx'

export default function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const openEnquiry = useCallback(() => setEnquiryOpen(true), [])
  const closeEnquiry = useCallback(() => setEnquiryOpen(false), [])

  useEffect(() => {
    const elements = [...document.querySelectorAll('[data-reveal]')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <SiteHeader onEnquire={openEnquiry} />
      <main>
        <Hero />
        <div className="paper-surface">
          <StorySection />
          <GallerySection />
        </div>
        <FilmSection />
        <section className="closing-section" aria-labelledby="closing-title">
          <div data-reveal>
            <h2 id="closing-title">Come experience ALBA.</h2>
            <button className="outline-button" type="button" onClick={openEnquiry}>
              Arrange a private viewing
            </button>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#top" aria-label="Back to the top">ALBA</a>
        <nav aria-label="Footer navigation">
          <a href="#residence">Residence</a>
          <a href="#spaces">Spaces</a>
          <a href="#film">Film</a>
          <button type="button" onClick={openEnquiry}>Enquire</button>
        </nav>
      </footer>
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
    </>
  )
}
