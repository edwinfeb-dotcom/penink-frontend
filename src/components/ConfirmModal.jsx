import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import './ConfirmModal.css'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    type: 'warning',
  })

  const resolverRef = useRef(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setState({
        isOpen: true,
        title: options.title || 'Konfirmasi',
        message: options.message || 'Apakah Anda yakin?',
        confirmText: options.confirmText || 'Ya, Lanjutkan',
        cancelText: options.cancelText || 'Batal',
        type: options.type || 'warning',
      })
    })
  }, [])

  const handleConfirm = () => {
    if (resolverRef.current) {
      resolverRef.current(true)
      resolverRef.current = null
    }
    setState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleCancel = () => {
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
    setState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state.isOpen && (
        <div className="confirm-backdrop" onClick={handleCancel}>
          <div
            className={`confirm-modal confirm-modal--${state.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="confirm-modal__close"
              onClick={handleCancel}
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            <div className="confirm-modal__icon">
              <AlertTriangle size={28} />
            </div>

            <h3 className="confirm-modal__title">{state.title}</h3>
            <p className="confirm-modal__message">{state.message}</p>

            <div className="confirm-modal__actions">
              <button
                type="button"
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={handleCancel}
              >
                {state.cancelText}
              </button>
              <button
                type="button"
                className="confirm-modal__btn confirm-modal__btn--confirm"
                onClick={handleConfirm}
              >
                {state.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm harus dipakai di dalam <ConfirmProvider>')
  }
  return ctx
}