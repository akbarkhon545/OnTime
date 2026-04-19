import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { LanguageSelector } from "./language-selector"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return (
    <div className="p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">⚙️ Sozlamalar</h1>
        <p className="text-slate-500 text-sm mt-1">Profil va ilova sozlamalarini boshqarish</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-100" />
        
        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600 text-base">👤</span>
          Shaxsiy ma&apos;lumotlar
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
          <div className="relative group/avatar">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-indigo-200 overflow-hidden transition-transform group-hover/avatar:scale-105 duration-500">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-xs border border-slate-100">
              ✨
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-black text-slate-900">{user?.name}</h3>
            <p className="text-slate-500 font-medium">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {user?.authProvider === "google" ? "🔗 Google Account" : "📧 Email Auth"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                ⭐ Premium User
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">To&apos;liq ism</label>
            <div className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-600 font-bold text-sm">
              {user?.name}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Elektron pochta</label>
            <div className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-600 font-bold text-sm">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <span className="p-2 bg-purple-50 rounded-lg text-purple-600 text-base">🌐</span>
          Til va mintaqa
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ilova tili</label>
            <LanguageSelector initialLanguage={user?.language || "uz"} />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mintaqa vaqti</label>
            <div className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-600 font-bold text-sm flex items-center justify-between">
              <span>{user?.timezone || "Asia/Tashkent"}</span>
              <span className="text-xs font-black text-indigo-500 uppercase">Avto</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium px-1">
              Vaqt mintaqasi qurilmangiz sozlamalariga qarab avtomatik belgilanadi.
            </p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">ℹ️ Ilova haqida</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Versiya</span>
            <span className="font-semibold text-slate-700">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Backend</span>
            <span className="font-semibold text-slate-700">Next.js + Neon PostgreSQL</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Mobil ilova</span>
            <span className="font-semibold text-slate-700">Android (Kotlin)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Yaratildi</span>
            <span className="font-semibold text-slate-700">2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
