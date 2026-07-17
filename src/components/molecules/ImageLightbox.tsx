import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export default function ImageLightbox({ src, alt, className, style, onError }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, close])

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ cursor: 'pointer', ...style }}
        onClick={() => setOpen(true)}
        onError={onError}
      />
      {open && createPortal(
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
