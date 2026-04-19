"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LanguageSelectorProps {
  initialLanguage: string
}

export function LanguageSelector({ initialLanguage }: LanguageSelectorProps) {
  const [language, setLanguage] = useState(initialLanguage)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLanguageChange = async (newLang: string) => {
    if (newLang === language || loading) return

    setLoading(true)
    setLanguage(newLang)

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update language:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4">
      {/* O'zbek tili */}
      <div 
        onClick={() => handleLanguageChange("uz")}
        className={`relative flex-1 p-5 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden group ${
          language === "uz" 
            ? "border-indigo-500 bg-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-500/5 scale-[1.02]" 
            : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-xl"
        } ${loading ? "opacity-50 cursor-wait" : ""}`}
      >
        <div className={`absolute -right-2 -top-2 text-6xl font-black transition-all duration-500 select-none ${
          language === "uz" ? "text-indigo-500/10 rotate-12 scale-110" : "text-slate-200/50 rotate-0 scale-100"
        }`}>
          UZ
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center text-2xl shadow-inner transition-all duration-500 ${
            language === "uz" ? "bg-indigo-500 shadow-indigo-200 rotate-0" : "bg-white group-hover:rotate-6 shadow-slate-100"
          }`}>
            🇺🇿
          </div>
          <p className={`text-sm font-black tracking-wide transition-colors duration-500 ${
            language === "uz" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
          }`}>
            O&apos;ZBEK
          </p>
          <div className={`mt-2 h-1.5 rounded-full transition-all duration-500 ${
            language === "uz" ? "w-10 bg-indigo-500" : "w-0 bg-slate-200"
          }`} />
        </div>
      </div>

      {/* Rus tili */}
      <div 
        onClick={() => handleLanguageChange("ru")}
        className={`relative flex-1 p-5 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden group ${
          language === "ru" 
            ? "border-indigo-500 bg-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-500/5 scale-[1.02]" 
            : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-xl"
        } ${loading ? "opacity-50 cursor-wait" : ""}`}
      >
        <div className={`absolute -right-2 -top-2 text-6xl font-black transition-all duration-500 select-none ${
          language === "ru" ? "text-indigo-500/10 rotate-12 scale-110" : "text-slate-200/50 rotate-0 scale-100"
        }`}>
          RU
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center text-2xl shadow-inner transition-all duration-500 ${
            language === "ru" ? "bg-indigo-500 shadow-indigo-200 rotate-0" : "bg-white group-hover:rotate-6 shadow-slate-100"
          }`}>
            🇷🇺
          </div>
          <p className={`text-sm font-black tracking-wide transition-colors duration-500 ${
            language === "ru" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
          }`}>
            РУССКИЙ
          </p>
          <div className={`mt-2 h-1.5 rounded-full transition-all duration-500 ${
            language === "ru" ? "w-10 bg-indigo-500" : "w-0 bg-slate-200"
          }`} />
        </div>
      </div>
    </div>
  )
}
