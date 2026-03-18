import { useEffect, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"

export interface SearchSelectProps<T, V> {
  label?: string
  placeholder?: string

  items: T[]
  value: V | null
  onChange: (value: V | null) => void

  getId: (item: T) => V
  getLabel: (item: T) => string
  filterBy?: (item: T, search: string) => boolean

  renderItem?: (item: T) => React.ReactNode

  isLoading?: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export function SearchSelect<T, V>({
  label,
  placeholder = "Buscar...",
  items,
  value,
  onChange,
  getId,
  getLabel,
  filterBy,
  renderItem,
  isLoading = false,
  disabled = false,
  size = "md",
}: SearchSelectProps<T, V>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((i) => getId(i) === value)

  const filteredItems = items.filter((item) => {
    if (!search) return true
    return filterBy
      ? filterBy(item, search)
      : getLabel(item).toLowerCase().includes(search.toLowerCase())
  })

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /** Mapeamento de tamanhos */
  const sizeStyles = {
    sm: {
      input: "h-9 text-sm pl-9 pr-9",
      icon: "w-4 h-4 left-3",
      dropdown: "text-sm",
    },
    md: {
      input: "h-11 text-base pl-10 pr-10",
      icon: "w-4 h-4 left-3",
      dropdown: "text-sm",
    },
    lg: {
      input: "h-14 text-lg pl-12 pr-12",
      icon: "w-5 h-5 left-4",
      dropdown: "text-base",
    },
  }

  const styles = sizeStyles[size]

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${styles.icon}`}
        />

        <input
          type="text"
          disabled={disabled}
          value={open ? search : selectedItem ? getLabel(selectedItem) : ""}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          className={`
            w-full ${styles.input}
            bg-slate-700/50 border-2 border-slate-600/50 rounded-xl
            text-white placeholder:text-slate-400
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            focus:outline-none
            disabled:bg-slate-700/30 disabled:cursor-not-allowed
            transition-all
          `}
        />

        {isLoading && (
          <Loader2
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
            size={size === "lg" ? 20 : 16}
          />
        )}
      </div>

      {open && (
        <div
          className={`
            mt-1 max-h-60 overflow-auto
            bg-slate-700/95 backdrop-blur-xl border-2 border-slate-600/50
            rounded-xl shadow-2xl z-50
            ${styles.dropdown}
          `}
        >
          {filteredItems.length === 0 && !isLoading && (
            <div className="px-4 py-3 text-slate-400">
              Nenhum resultado encontrado
            </div>
          )}

          {filteredItems.map((item) => {
            const id = getId(item)
            return (
              <button
                key={String(id)}
                type="button"
                onClick={() => {
                  onChange(id)
                  setSearch("")
                  setOpen(false)
                }}
                className="
                  w-full text-left px-4 py-3
                  text-white
                  hover:bg-slate-600/50
                  transition-colors
                "
              >
                {renderItem ? renderItem(item) : getLabel(item)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
