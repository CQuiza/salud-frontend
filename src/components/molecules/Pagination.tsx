import { Pagination as BsPagination } from 'react-bootstrap'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const items: React.ReactNode[] = []
  const maxVisible = 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  items.push(
    <BsPagination.Prev key="prev" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
  )
  for (let i = start; i <= end; i++) {
    items.push(
      <BsPagination.Item key={i} active={i === page} onClick={() => onPageChange(i)}>
        {i}
      </BsPagination.Item>
    )
  }
  items.push(
    <BsPagination.Next key="next" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
  )

  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-3 border-top">
      <small className="text-muted">Página {page} de {totalPages}</small>
      <BsPagination className="mb-0">{items}</BsPagination>
    </div>
  )
}
