"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface TaskActionsProps {
  taskId: string
  currentStatus: string
  lang?: string
}

export function TaskActions({ taskId, currentStatus, lang = "uz" }: TaskActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isRu = lang === "ru"

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async () => {
    const confirmMsg = isRu ? "Вы уверены, что хотите удалить эту задачу?" : "Bu vazifani o'chirmoqchimisiz?"
    if (!confirm(confirmMsg)) return
    setLoading(true)
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {currentStatus !== "completed" && (
        <button
          onClick={() => updateStatus("completed")}
          disabled={loading}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-50 hover:shadow-inner transition-all disabled:opacity-50"
          title={isRu ? "Завершено" : "Bajarildi"}
        >
          <span className="text-lg">✓</span>
        </button>
      )}
      {currentStatus === "completed" && (
        <button
          onClick={() => updateStatus("pending")}
          disabled={loading}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-600 hover:bg-amber-50 hover:shadow-inner transition-all disabled:opacity-50"
          title={isRu ? "Вернуть" : "Qaytarish"}
        >
          <span className="text-lg">↩</span>
        </button>
      )}
      <button
        onClick={deleteTask}
        disabled={loading}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 hover:shadow-inner transition-all disabled:opacity-50"
        title={isRu ? "Удалить" : "O'chirish"}
      >
        <span className="text-lg">🗑</span>
      </button>
    </div>
  )
}
