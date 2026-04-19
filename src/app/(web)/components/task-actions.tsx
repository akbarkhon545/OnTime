"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface TaskActionsProps {
  taskId: string
  currentStatus: string
}

export function TaskActions({ taskId, currentStatus }: TaskActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
    if (!confirm("Bu vazifani o'chirmoqchimisiz?")) return
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
    <div className="flex items-center gap-1.5">
      {currentStatus !== "completed" && (
        <button
          onClick={() => updateStatus("completed")}
          disabled={loading}
          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          title="Bajarildi"
        >
          ✓
        </button>
      )}
      {currentStatus === "completed" && (
        <button
          onClick={() => updateStatus("pending")}
          disabled={loading}
          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
          title="Qaytarish"
        >
          ↩
        </button>
      )}
      <button
        onClick={deleteTask}
        disabled={loading}
        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
        title="O'chirish"
      >
        🗑
      </button>
    </div>
  )
}
