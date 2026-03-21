import { Fragment } from "react"
import { Transition } from "@headlessui/react"
import { Link } from "react-router-dom"
import { LogOut, X, ChevronRight } from "lucide-react"
import { getMenuItems } from "./menuItems"
import type { Client } from "../../../types/client/client"

interface Props {
  open: boolean
  onClose: () => void
  user: Client | null
  onLogout: () => void
}

export function MobileDrawerMenu({ open, onClose, user, onLogout }: Props) {
  const displayName = user?.name ?? user?.username ?? "Cliente"
  const menuItems   = getMenuItems(user?.id ?? "")

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()

  return (
    <Transition show={open} as={Fragment}>
      <div className="md:hidden fixed inset-0 z-50">

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-250"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-zinc-950 border-l border-zinc-900 flex flex-col shadow-2xl shadow-black/60">

            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
              <span className="text-white font-bold text-sm tracking-tight font-serif">
                Cinema<span className="text-amber-500">Reserve</span>
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-zinc-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 py-4 border-b border-zinc-900">
              <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-4 py-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-zinc-500 text-[11px] truncate mt-0.5">{user?.email ?? ""}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3">
              <div className="space-y-0.5">
                {menuItems.map(item => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className="group flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                          <Icon size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="px-3 py-3 border-t border-zinc-900">
              <button
                onClick={() => { onClose(); onLogout() }}
                className="group w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-red-900 flex items-center justify-center transition-colors">
                    <LogOut size={14} className="text-red-400 group-hover:text-red-300 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                    Sair
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-red-900 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            </div>

          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}