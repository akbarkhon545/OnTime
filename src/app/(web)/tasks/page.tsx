import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { AddTaskForm } from "../components/add-task-form"
import { TaskActions } from "../components/task-actions"

export default async function TasksPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ taskDate: "desc" }, { startTime: "asc" }],
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  // Vazifalarni sanaga qarab guruhlash
  const grouped: Record<string, typeof tasks> = {}
  tasks.forEach((task) => {
    const dateKey = new Date(task.taskDate).toISOString().split("T")[0]
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(task)
  })

  const priorityIcon: Record<string, string> = {
    high: "🔴",
    medium: "🟡",
    low: "🟢",
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "📅 Bugun"
    if (date.toDateString() === tomorrow.toDateString()) return "📅 Ertaga"
    if (date.toDateString() === yesterday.toDateString()) return "📅 Kecha"

    return date.toLocaleDateString("uz-UZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">📋 Vazifalar</h1>
          <p className="text-slate-500 text-sm mt-1">Barcha rejalaringiz bir joyda</p>
        </div>
        <AddTaskForm categories={categories} />
      </div>

      {/* Task List */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateKey, dateTasks]) => (
            <div key={dateKey}>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                {formatDate(dateKey)}
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-50">
                {dateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${
                      task.status === "completed" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Priority dot */}
                      <span className="text-sm flex-shrink-0">{priorityIcon[task.priority] || "🟡"}</span>

                      {/* Category color */}
                      <div
                        className="w-2 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: task.category?.color || "#CBD5E1" }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm truncate ${
                          task.status === "completed" ? "line-through text-slate-400" : "text-slate-800"
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {task.startTime && (
                            <span className="text-xs text-slate-400">
                              🕐 {task.startTime}
                              {task.endTime && ` — ${task.endTime}`}
                            </span>
                          )}
                          {task.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              {task.category.icon} {task.category.nameUz}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <TaskActions taskId={task.id} currentStatus={task.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 py-20 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Hozircha vazifalar yo&apos;q</h3>
          <p className="text-slate-400 text-sm mb-6">
            Birinchi vazifangizni qo&apos;shing va kunni rejalashtiring
          </p>
        </div>
      )}
    </div>
  )
}
