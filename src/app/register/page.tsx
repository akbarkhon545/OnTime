"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { logoBase64 } from "@/lib/logo-base64"
import { getTranslation, Language } from "@/lib/translations"

export default function RegisterPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Language>("uz")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const t = getTranslation(lang)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, language: lang }),
      })

      if (res.ok) {
        router.push("/login")
      } else {
        const data = await res.json()
        setError(data.message || (lang === "ru" ? "Ошибка при регистрации" : "Ro'yxatdan o'tishda xatolik"))
      }
    } catch (err) {
      setError(lang === "ru" ? "Проблема с соединением" : "Aloqa xatosi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-48 -mb-48 animate-pulse" />

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 flex gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl z-20">
        <button 
          onClick={() => setLang("uz")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${lang === "uz" ? "bg-white text-indigo-900 shadow-lg" : "text-white/50 hover:text-white"}`}
        >
          UZ
        </button>
        <button 
          onClick={() => setLang("ru")}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${lang === "ru" ? "bg-white text-indigo-900 shadow-lg" : "text-white/50 hover:text-white"}`}
        >
          RU
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="relative w-16 h-16 mx-auto mb-3 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-transform group-hover:scale-110 duration-500">
              <Image src={logoBase64} alt="OnTime" fill unoptimized className="object-contain" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">OnTime</h1>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight">{t.registerTitle}</h2>
          <p className="text-indigo-200/50 text-sm text-center mb-8 font-medium">{t.registerDesc}</p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-indigo-200/50 uppercase tracking-widest ml-1">{t.fullName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-indigo-200/50 uppercase tracking-widest ml-1">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-indigo-200/50 uppercase tracking-widest ml-1">{lang === "ru" ? "ПАРОЛЬ" : "PAROL"}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 text-sm mt-4"
            >
              {loading ? "..." : (lang === "ru" ? "ЗАРЕГИСТРИРОВАТЬСЯ" : "RO'YXATDAN O'TISH")}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-indigo-200/30">
            {t.alreadyHaveAccount}{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-400/30 pb-0.5 ml-1">
              {lang === "ru" ? "Войти" : "Kirish"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
