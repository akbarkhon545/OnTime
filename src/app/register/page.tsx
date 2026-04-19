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

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t.or}</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <button
            onClick={() => import("next-auth/react").then(m => m.signIn("google", { callbackUrl: "/dashboard" }))}
            className="w-full py-4 px-8 bg-white text-slate-900 font-black rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t.signInWithGoogle}
          </button>

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
