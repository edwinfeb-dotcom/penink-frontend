import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import './SuccessCard.css'

function SuccessCard({
  title = 'Berhasil!',
  message = 'Pesan Anda telah berhasil dikirim.',
  emoji = '✅',
  primaryButtonText = null,
  onPrimaryClick = null,
  onClose = null,
  autoCloseMs = 0,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Animasi masuk
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Auto close (opsional)
  useEffect(() => {
    if (!autoCloseMs || autoCloseMs <= 0) return

    const timer = setTimeout(() => {
      handleClose()
    }, autoCloseMs)

    return () => clearTimeout(timer)
  }, [autoCloseMs])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  return (
    <div
      className={`success-card-overlay ${isVisible ? 'is-visible' : ''} ${
        isLeaving ? 'is-leaving' : ''
      }`}
    >
      <div className="success-card">
        {/* Tombol close pojok kanan atas */}
        {onClose && (
          <button
            type="button"
            className="success-card__close"
            onClick={handleClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        )}

        {/* Dekorasi background */}
        <div className="success-card__deco" aria-hidden="true">
          <div className="success-card__deco-circle success-card__deco-circle--1" />
          <div className="success-card__deco-circle success-card__deco-circle--2" />
          <div className="success-card__deco-circle success-card__deco-circle--3" />
        </div>

        {/* Konten utama */}
        <div className="success-card__content">
          <div className="success-card__icon-wrap">
            <div className="success-card__icon-pulse" />
            <div className="success-card__icon-bg">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
          </div>

          <div className="success-card__emoji">{emoji}</div>

          <h2 className="success-card__title">{title}</h2>

          <p className="success-card__message">{message}</p>

          {primaryButtonText && onPrimaryClick && (
            <button
              type="button"
              className="success-card__btn-primary"
              onClick={() => {
                onPrimaryClick()
                handleClose()
              }}
            >
              {primaryButtonText}
            </button>
          )}

          {onClose && !primaryButtonText && (
            <button
              type="button"
              className="success-card__btn-secondary"
              onClick={handleClose}
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessCard