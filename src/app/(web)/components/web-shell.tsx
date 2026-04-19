"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { SignOutButton } from "./sign-out-button"
import { logoBase64 } from "@/lib/logo-base64"

interface WebShellProps {
  children: React.ReactNode
  session: any
  t: any
}

export function WebShell({ children, session, t }: WebShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const NavLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsSidebarOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src={logoBase64} alt="OnTime" fill unoptimized className="object-contain" />
          </div>
          <span className="text-lg font-bold">OnTime</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo (Desktop) */}
        <div className="hidden md:flex px-6 py-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src={logoBase64} alt="OnTime" fill unoptimized className="object-contain" />
            </div>
            <span className="text-xl font-bold">OnTime</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavLink href="/dashboard" icon="📊" label={t.dashboard} />
          <NavLink href="/tasks" icon="📋" label={t.tasks} />
          <NavLink href="/calendar" icon="📅" label={t.calendar} />
          <NavLink href="/notes" icon="📝" label={t.notes} />
          <NavLink href="/categories" icon="🏷️" label={t.categories} />
          <NavLink href="/settings" icon="⚙️" label={t.settings} />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                session.user.name?.charAt(0) || "U"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
            </div>
          </div>
          <SignOutButton label={t.signOut} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
