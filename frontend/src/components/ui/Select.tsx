import { type ReactNode, type SelectHTMLAttributes } from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  leftIcon?: ReactNode
  children: ReactNode
}

export function Select({
  label,
  error,
  leftIcon,
  children,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>

      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        <select
          className={`
            w-full ${leftIcon ? "pl-10" : "pl-3"} pr-10 py-3
            border rounded-lg bg-slate-700/50 border-slate-600/50
            text-white
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            transition-all appearance-none
            ${error ? "border-red-500" : ""}
            ${className ?? ""}
            [&>option]:bg-slate-800
            [&>option]:text-white
            [&>option]:py-2
            [&>option:checked]:bg-blue-500
            [&>option:hover]:bg-slate-700
          `}
          {...props}
        >
          {children}
        </select>

        <div
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            pointer-events-none
            transition-transform duration-200
            group-focus-within:rotate-180
          "
        >
          <ChevronDown className="w-5 h-5 text-blue-300" />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <svg 
            className="w-4 h-4 text-red-400 shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}