import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { MENU_ITEMS } from "./menuItems"
import { UserAvatar } from "./UserAvatar"
import type { User } from "../../../types/client/user"

interface Props {
  user: User | null
  onLogout: () => void
}

export function DesktopUserMenu({ user, onLogout }: Props) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700/80 transition-colors">
        <UserAvatar user={user} size="sm" />
        <span className="max-w-[100px] truncate text-sm font-medium text-slate-200">
          {user?.username}
        </span>
      </Menu.Button>

      <Transition as={Fragment}>
        <Menu.Items className="
            absolute right-0 mt-3 w-64
            bg-slate-800/80 backdrop-blur-xl rounded-2xl
            shadow-2xl border border-slate-700/50
        ">
        <div className="px-4 py-3 border-b border-slate-700/70">
            <p className="text-sm font-medium truncate text-white">{user?.username}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>


          <div className="py-1 ">
            {MENU_ITEMS.map(item => {
              const Icon = item.icon
              return (
                <Menu.Item key={item.to}>
                  {({ active }) => (
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        active ? "bg-blue-500/20 text-blue-300" : "text-slate-200"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  )}
                </Menu.Item>
              )
            })}
          </div>

          <div className="mt-1 pt-1 border-t border-slate-700/70">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onLogout}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    active ? "bg-red-500/20 text-red-300 rounded-b-2xl" : "text-slate-200"
                  }`}
                >
                  <LogOut size={18} />
                  Sair
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
