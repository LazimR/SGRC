import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu as MenuIcon, X, Film, LogOut, User, Ticket, ChevronDown } from "lucide-react"
import { useUser } from "../../../context/useUser"
import useFlashMessage from "../../../hooks/useFlashMessage"
import type { Client } from "../../../types/client/client"

import { MobileDrawerMenu } from "./MobileDrawerMenu"

function NavBar() {
  const { authenticated, user, logout } = useUser()
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  const [open, setOpen] = useState(false)
  const [requestUser, setRequestUser] = useState<Client | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [open])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-dropdown]")) setDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [dropdownOpen])

  async function handleLogout() {
    const response = await logout()
    if (response.success) {
      setFlashMessage("success", response.message)
      navigate("/")
    } else {
      setFlashMessage("error", response.message || "Erro ao fazer logout")
    }
  }

  const displayName =
    requestUser?.name ?? user?.name ?? user?.username ?? "Cliente"

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900">
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-200">
                <Film className="text-amber-500" size={16} />
              </div>
              <span className="text-white font-bold text-base sm:text-lg tracking-tight font-serif">
                Cinema<span className="text-amber-500">Reserve</span>
              </span>
            </Link>

            {/* ── Desktop right side ── */}
            <div className="hidden md:flex items-center gap-2">
              {!authenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-zinc-400 font-medium rounded-xl hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    Entrar
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.03] text-sm"
                  >
                    Criar Conta
                  </Link>
                </>
              ) : (
                /* ── Desktop user dropdown ── */
                <div className="relative" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-zinc-800 transition-all group"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {initials}
                    </div>
                    <span className="text-zinc-300 text-sm font-medium max-w-[120px] truncate group-hover:text-white transition-colors">
                      {displayName}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-zinc-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                        <p className="text-zinc-500 text-[11px] truncate mt-0.5">
                          {user?.email ?? ""}
                        </p>
                      </div>

                      {/* Links */}
                      <div className="py-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                          <User size={14} />
                          Meu Perfil
                        </Link>
                        <Link
                          to="/reservations"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                          <Ticket size={14} />
                          Minhas Reservas
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-zinc-800 py-1.5">
                        <button
                          type="button"
                          onClick={() => { setDropdownOpen(false); handleLogout() }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                        >
                          <LogOut size={14} />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Mobile toggle ── */}
            <button
              type="button"
              onClick={() => setOpen(prev => !prev)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-800 transition-all"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X size={18} /> : <MenuIcon size={18} />}
            </button>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {authenticated && (
        <MobileDrawerMenu
          open={open}
          onClose={() => setOpen(false)}
          user={requestUser}
          onLogout={handleLogout}
        />
      )}

      {/* Unauthenticated mobile bottom sheet */}
      {!authenticated && open && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute top-14 left-0 right-0 bg-zinc-950 border-b border-zinc-900 px-4 py-5 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-3 rounded-xl text-zinc-300 font-medium border border-zinc-800 hover:bg-white/5 hover:text-white transition-all text-sm"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 transition-all text-sm"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
