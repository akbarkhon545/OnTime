import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">⚙️ Sozlamalar</h1>
        <p className="text-slate-500 text-sm mt-1">Profil va ilova sozlamalari</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">👤 Profil</h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-slate-500">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {user?.authProvider === "google" ? "🔗 Google" : "📧 Email"} orqali kirgan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ism</label>
            <input
              type="text"
              defaultValue={user?.name || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">🌐 Til va mintaqa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Til</label>
            <div className="flex gap-3">
              <div className={`flex-1 p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                user?.language === "uz" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              }`}>
                <span className="text-lg">🇺🇿</span>
                <p className="text-xs font-semibold mt-1">O&apos;zbek</p>
              </div>
              <div className={`flex-1 p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                user?.language === "ru" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              }`}>
                <span className="text-lg">🇷🇺</span>
                <p className="text-xs font-semibold mt-1">Русский</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mintaqa vaqti</label>
            <input
              type="text"
              defaultValue={user?.timezone || "Asia/Tashkent"}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
            />
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
