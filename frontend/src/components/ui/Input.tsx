import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isPassword?: boolean
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  type = "text",
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword
    ? (showPassword ? "text" : "password")
    : type

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-white">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        <input
          {...rest}
          type={inputType}
          className={`
            w-full px-3 py-3 rounded-lg border bg-slate-700/50 border-slate-600/50
            text-white
            placeholder:text-slate-400
            ${leftIcon ? "pl-10" : ""}
            ${isPassword || rightIcon ? "pr-10" : ""}
            ${error ? "border-amber-500" : ""}
            focus:outline-none focus:ring-2 focus:ring-amber-400
            [&:-webkit-autofill]:bg-slate-700/50!
            [&:-webkit-autofill]:[-webkit-text-fill-color:white]
            [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(51_65_85/0.5)_inset]
            [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_rgb(51_65_85/0.5)_inset]
            [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_rgb(51_65_85/0.5)_inset]
          `}
        />

        {/* Ícone à direita (caso não seja de senha) */}
        {!isPassword && rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none z-10">
            {rightIcon}
          </div>
        )}

        {/* Toggle password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 z-10"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <svg 
            className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="text-sm text-amber-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}