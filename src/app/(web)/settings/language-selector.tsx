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
    <div className="flex gap-3">
      <div 
        onClick={() => handleLanguageChange("uz")}
        className={`flex-1 p-4 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 group ${
          language === "uz" 
            ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10" 
            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
        } ${loading ? "opacity-50 cursor-wait" : ""}`}
      >
        <span className="text-2xl block mb-1 group-hover:scale-125 transition-transform">🇺🇿</span>
        <p className={`text-sm font-bold ${language === "uz" ? "text-indigo-600" : "text-slate-600"}`}>
          O&apos;zbek
        </p>
        <div className={`mt-1.5 h-1 w-8 mx-auto rounded-full transition-all ${language === "uz" ? "bg-indigo-500" : "bg-transparent"}`} />
      </div>

      <div 
        onClick={() => handleLanguageChange("ru")}
        className={`flex-1 p-4 rounded-2xl border-2 text-center cursor-pointer transition-all duration-300 group ${
          language === "ru" 
            ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10" 
            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
        } ${loading ? "opacity-50 cursor-wait" : ""}`}
      >
        <span className="text-2xl block mb-1 group-hover:scale-125 transition-transform">🇷🇺</span>
        <p className={`text-sm font-bold ${language === "ru" ? "text-indigo-600" : "text-slate-600"}`}>
          Русский
        </p>
        <div className={`mt-1.5 h-1 w-8 mx-auto rounded-full transition-all ${language === "ru" ? "bg-indigo-500" : "bg-transparent"}`} />
      </div>
    </div>
  )
}
