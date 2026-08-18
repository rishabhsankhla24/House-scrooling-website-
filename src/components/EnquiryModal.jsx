import React, { useEffect, useRef, useState } from 'react'
import { CloseIcon } from './Icons.jsx'

export default function EnquiryModal({ open, onClose }) {
  const panelRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const previousActive = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => firstFieldRef.current?.focus(), 60)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousActive?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setSubmitted(false)
  }, [open])

  if (!open) return null

  const onSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        className="enquiry-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close enquiry">
          <CloseIcon />
        </button>

        {submitted ? (
          <div className="success-state" aria-live="polite">
            <span className="success-line" />
            <h2 id="enquiry-title">Thank you.</h2>
            <p>We’ve received your enquiry and will be in touch to arrange your private viewing.</p>
            <button className="dark-button" type="button" onClick={onClose}>Return to ALBA</button>
          </div>
        ) : (
          <>
            <div className="modal-heading">
              <span aria-hidden="true">Private viewing</span>
              <h2 id="enquiry-title">Arrange a private viewing.</h2>
              <p>Share a few details and we’ll contact you personally.</p>
            </div>
            <form className="enquiry-form" onSubmit={onSubmit}>
              <label>
                <span>Name</span>
                <input ref={firstFieldRef} type="text" name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                <span>Preferred date</span>
                <input type="date" name="date" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="3" />
              </label>
              <button className="dark-button" type="submit">Send enquiry</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
