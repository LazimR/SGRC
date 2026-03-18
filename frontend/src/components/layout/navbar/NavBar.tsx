import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu as MenuIcon, X, Film } from "lucide-react"
import { useUser } from "../../../context/useUser"
import { requestData } from "../../../services/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"
import type { User } from "../../../types/client/user"

import { DesktopUserMenu } from "./DesktopUserMenu"
import { MobileDrawerMenu } from "./MobileDrawerMenu"

function NavBar() {
  const { authenticated, user, logout } = useUser()
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  const [open, setOpen] = useState(false)
  const [requestUser, setRequestUser] = useState<User | null>(null)

  useEffect(() => {
    if (!user?.id) return

    async function fetchUser() {
      const response = await requestData<User>(
        `/user/${user?.id}`,
        "GET",
        {},
        true
      )

      if (response.success && response.data) {
        setRequestUser(response.data)
      }
    }

    fetchUser()
  }, [user])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  async function handleLogout() {
    const response = await logout()

    if (response.success) {
      setFlashMessage("success", response.message)
      navigate("/")
    } else {
      setFlashMessage("error", response.message || "Erro ao fazer logout")
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:bg-amber-600/30 transition-colors">
                <Film className="text-amber-500" size={18} />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Cinema<span className="text-amber-500">Reserve</span>
              </span>
            </Link>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setOpen(prev => !prev)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <X size={22} /> : <MenuIcon size={22} />}
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-3">
              {!authenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-zinc-400 font-medium rounded-xl hover:text-white hover:bg-zinc-800 transition-all text-sm"
                  >
                    Entrar
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-[1.03] text-sm"
                  >
                    Criar Conta
                  </Link>
                </>
              ) : (
                <DesktopUserMenu
                  user={requestUser}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {authenticated && (
        <MobileDrawerMenu
          open={open}
          onClose={() => setOpen(false)}
          user={requestUser}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}

export default NavBar
