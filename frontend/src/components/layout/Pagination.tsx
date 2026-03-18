import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  label: string
}

function Pagination({
  page,
  total,
  limit,
  onPageChange,
  label,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit)

  const startIndex = (page - 1) * limit + 1
  const endIndex = Math.min(page * limit, total)

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-slate-900 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white text-center sm:text-left">
          Mostrando{" "}
          <span className="font-semibold text-white">
            {startIndex}-{endIndex}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-white">
            {total}
          </span>{" "}
          {label}
        </p>

        <div className="flex items-center justify-center gap-2">
          {/* Previous */}
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="
              flex items-center gap-1
              px-4 py-2.5
              rounded-xl text-sm font-medium
              transition-all
              disabled:opacity-40
              disabled:cursor-not-allowed
              bg-slate-100 hover:bg-slate-200
              text-slate-700
            "
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum

              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    min-w-10 h-10
                    rounded-xl text-sm font-semibold
                    transition-all
                    ${
                      page === pageNum
                        ? "bg-linear-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="
              flex items-center gap-1
              px-4 py-2.5
              rounded-xl text-sm font-medium
              transition-all
              disabled:opacity-40
              disabled:cursor-not-allowed
              bg-slate-100 hover:bg-slate-200
              text-slate-700
            "
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
