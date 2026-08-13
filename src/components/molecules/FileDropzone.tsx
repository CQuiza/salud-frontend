import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FaUpload } from 'react-icons/fa'
import { isAllowedLessonFile, LESSON_FILE_MAX_SIZE_MB } from '../../lib/lessonFiles'

interface FileDropzoneProps {
  multiple?: boolean
  disabled?: boolean
  onFiles: (files: File[]) => void
}

export default function FileDropzone({ multiple = false, disabled = false, onFiles }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const maxBytes = LESSON_FILE_MAX_SIZE_MB * 1024 * 1024

  function handleFileList(list: FileList | null) {
    if (!list) return
    const valid: File[] = []
    Array.from(list).forEach((file) => {
      if (!isAllowedLessonFile(file)) {
        toast.error(`Extensión no permitida: ${file.name}`)
        return
      }
      if (file.size > maxBytes) {
        toast.error(`Supera el límite de ${LESSON_FILE_MAX_SIZE_MB} MB: ${file.name}`)
        return
      }
      valid.push(file)
    })
    if (valid.length > 0) onFiles(valid)
  }

  function openPicker() {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault()
          openPicker()
        }
      }}
      onDragEnter={(e) => { e.preventDefault(); if (!disabled) setDragActive(true) }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragActive(true) }}
      onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); if (!disabled) handleFileList(e.dataTransfer.files) }}
      className={`d-flex flex-column align-items-center justify-content-center border border-dashed rounded-3 py-4 text-center cursor-pointer ${dragActive ? 'border-bar-600 bg-bar-50' : 'border-neutral-300'} ${disabled ? 'opacity-50' : ''}`}
      style={{ minHeight: 110 }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        className="d-none"
        onChange={(e) => { handleFileList(e.target.files); e.target.value = '' }}
      />
      <FaUpload className="text-muted mb-1" />
      <span className="small text-muted">
        Arrastra archivos aquí o <span className="text-bar-600 fw-medium">haz clic para elegir</span>
      </span>
      <small className="text-muted">PDF, Office, imágenes, video, ZIP… (máx. 50 MB)</small>
    </div>
  )
}