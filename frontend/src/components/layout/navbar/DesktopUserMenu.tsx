import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Link } from "react-router-dom"
import { LogOut, ChevronDown } from "lucide-react"
import { getMenuItems } from "./menuItems"
import type { Client } from "../../../types/client/client"

interface Props {
  user: Client | null
  onLogout: () => void
}

export function DesktopUserMenu({ user, onLogout }: Props) {
  const displayName = user?.name ?? user?.username ?? "Cliente"
  const menuItems   = getMenuItems(user?.id ?? "")
  console.log(user)
  console.log(menuItems)

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-zinc-800 transition-all group outline-none">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
              {initials}
            </div>
            <span className="text-zinc-300 text-sm font-medium max-w-[120px] truncate group-hover:text-white transition-colors">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className={`text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden outline-none">

              <div className="px-4 py-3 border-b border-zinc-800">
                <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                <p className="text-zinc-500 text-[11px] truncate mt-0.5">{user?.email ?? ""}</p>
              </div>

              <div className="py-1.5">
                {menuItems.map(item => {
                  const Icon = item.icon
                  return (
                    <Menu.Item key={item.to}>
                      {({ active }) => (
                        <Link
                          to={item.to}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            active ? "bg-white/5 text-white" : "text-zinc-400"
                          }`}
                        >
                          <Icon size={14} />
                          {item.label}
                        </Link>
                      )}
                    </Menu.Item>
                  )
                })}
              </div>

              <div className="border-t border-zinc-800 py-1.5">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                        active ? "bg-red-500/10 text-red-300" : "text-red-400"
                      }`}
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  )}
                </Menu.Item>
              </div>

            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}