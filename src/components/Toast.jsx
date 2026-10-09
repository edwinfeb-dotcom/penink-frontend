import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import './Toast.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now() + Math.random()

      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast]
  )

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  }
  return ctx
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  }

  return (
    <div className={`toast toast--${toast.type}`}>
      <div className="toast__icon">{icons[toast.type]}</div>
      <div className="toast__message">{toast.message}</div>
      <button
        type="button"
        className="toast__close"
        onClick={onClose}
        aria-label="Tutup"
      >
        <X size={14} />
      </button>
    </div>
  )
}