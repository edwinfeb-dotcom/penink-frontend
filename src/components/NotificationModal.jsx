import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './NotificationModal.css'

function NotificationModal({
  isOpen,
  variant = 'info',     // success | error | warning | info
  emoji = 'ℹ️',
  title = 'Notifikasi',
  message = '',
  buttonText = 'Mengerti',
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false)

  // Animasi masuk
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`notif-modal ${isVisible ? 'notif-modal--visible' : ''}`}
      onClick={onClose}
    >
      <div
        className={`notif-modal__card notif-modal__card--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol close */}
        <button
          type="button"
          className="notif-modal__close"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        {/* Emoji besar */}
        <div className="notif-modal__emoji-wrap">
          <span className="notif-modal__emoji">{emoji}</span>
        </div>

        {/* Title */}
        <h3 className="notif-modal__title">{title}</h3>

        {/* Message */}
        <p className="notif-modal__message">{message}</p>

        {/* Button */}
        <button
          type="button"
          className="notif-modal__btn"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default NotificationModal