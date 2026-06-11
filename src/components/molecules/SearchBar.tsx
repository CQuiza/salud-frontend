import { FaSearch } from 'react-icons/fa'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <div className="position-relative">
      <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ width: 14, height: 14 }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control ps-5"
      />
    </div>
  )
}
