import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./components/sign-out-button"
import Image from "next/image"

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo-ontime.png" alt="OnTime" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold">OnTime</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink href="/dashboard" icon="📊" label="Dashboard" />
          <NavLink href="/tasks" icon="📋" label="Vazifalar" />
          <NavLink href="/calendar" icon="📅" label="Kalendar" />
          <NavLink href="/categories" icon="🏷️" label="Kategoriyalar" />
          <NavLink href="/settings" icon="⚙️" label="Sozlamalar" />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-800">
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
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )
}
