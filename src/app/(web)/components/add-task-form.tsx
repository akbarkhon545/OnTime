"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getTranslation } from "@/lib/translations"

interface Category {
  id: string
  nameUz: string
  nameRu: string
  icon: string | null
}

export function AddTaskForm({ categories, lang = "uz" }: { categories: Category[], lang?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = getTranslation(lang)
  const isRu = lang === "ru"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: categories[0]?.id || "",
    taskDate: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    priority: "medium",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsOpen(false)
        setFormData({
          ...formData,
          title: "",
          description: "",
        })
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white text-sm font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
      >
        <span className="text-lg">+</span> {t.addTask}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-800">{t.addTask}</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-600 transition-all"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isRu ? "ЗАГОЛОВОК" : "SARLAVHA"}</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
              placeholder={isRu ? "Например: Сделать домашнее задание" : "Masalan: Uy vazifasini bajarish"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isRu ? "ДАТА" : "SANA"}</label>
              <input
                type="date"
                required
                value={formData.taskDate}
                onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none font-bold text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isRu ? "КАТЕГОРИЯ" : "KATEGORIYA"}</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none font-bold text-sm appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {isRu ? cat.nameRu : cat.nameUz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isRu ? "НАЧАЛО" : "BOSHLANISH"}</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none font-bold text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isRu ? "КОНЕЦ" : "TUGASH"}</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.priority}</label>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.priority === p
                      ? p === "high" ? "bg-red-500 text-white shadow-lg shadow-red-200" : p === "medium" ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {p === "high" ? t.high : p === "medium" ? t.medium : t.low}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 mt-4 active:scale-95"
          >
            {loading ? "..." : (isRu ? "СОХРАНИТЬ" : "SAQLASH")}
          </button>
        </form>
      </div>
    </div>
  )
}
