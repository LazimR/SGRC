import type { User } from "../../../types/client/user"

interface Props {
  user: User | null
  size?: "sm" | "md"
}

export function UserAvatar({ user, size = "md" }: Props) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-sm",
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold border border-blue-400/30 shadow-lg shadow-blue-500/20`}
    >
      {user?.username?.charAt(0).toUpperCase() || "U"}
    </div>
  )
}
