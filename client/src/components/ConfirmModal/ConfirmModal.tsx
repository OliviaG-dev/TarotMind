import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
} from '../Nav/NavIcons'
import '../../pages/Home/home.css'
import './ConfirmModal.css'

type ConfirmModalProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    cancelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div className="confirm-modal" onClick={onCancel}>
      <div
        className="confirm-modal__dialog home__feature-card home__feature-card--pink"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="home__feature-deco confirm-modal__deco" aria-hidden="true">
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftCrescentMoon className="confirm-modal__moon" />
          <DecoSoftSparkle className="confirm-modal__spark confirm-modal__spark--a" />
          <DecoSoftSparkle className="confirm-modal__spark confirm-modal__spark--b" />
          <DecoSoftSparkle className="confirm-modal__spark confirm-modal__spark--c" />
        </span>

        <div className="confirm-modal__content">
          <h2 id="confirm-modal-title" className="confirm-modal__title">
            {title}
          </h2>
          <p id="confirm-modal-message" className="confirm-modal__message">
            {message}
          </p>
          <div className="confirm-modal__actions">
            <button
              ref={cancelRef}
              type="button"
              className="confirm-modal__cancel"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`home__cta-btn confirm-modal__confirm${
                variant === 'danger' ? ' confirm-modal__confirm--danger' : ''
              }`}
              onClick={onConfirm}
            >
              <span className="home__cta-label">{confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
