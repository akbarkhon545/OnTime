import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { AddTaskForm } from "../components/add-task-form"
import { TaskActions } from "../components/task-actions"
import { getTranslation } from "@/lib/translations"
import { uz, ru } from "date-fns/locale"

export default async function TasksPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)
  const isRu = user?.language === "ru"

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

  // Group tasks by date
  const grouped: Record<string, typeof tasks> = {}
  tasks.forEach((task) => {
    const dateKey = new Date(task.taskDate).toISOString().split("T")[0]
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(task)
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return isRu ? "📅 Сегодня" : "📅 Bugun"
    if (date.toDateString() === tomorrow.toDateString()) return isRu ? "📅 Завтра" : "📅 Ertaga"
    if (date.toDateString() === yesterday.toDateString()) return isRu ? "📅 Вчера" : "📅 Kecha"

    return date.toLocaleDateString(isRu ? "ru-RU" : "uz-UZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">📋 {t.allTasks}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isRu ? "Все ваши планы в одном месте" : "Barcha rejalaringiz bir joyda"}
          </p>
        </div>
        <AddTaskForm categories={categories} lang={user?.language || "uz"} />
      </div>

      {/* Task List */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(grouped).map(([dateKey, dateTasks]) => (
            <div key={dateKey} className="animate-in slide-in-from-left-4 duration-500">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-3">
                <span className="w-8 h-px bg-slate-100" />
                {formatDate(dateKey)}
              </h2>
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {dateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group ${
                      task.status === "completed" ? "bg-slate-50/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      {/* Priority indicator */}
                      <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base transition-all truncate ${
                          task.status === "completed" ? "line-through text-slate-300" : "text-slate-800"
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          {task.startTime && (
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg">
                              🕐 {task.startTime}{task.endTime && ` — ${task.endTime}`}
                            </span>
                          )}
                          {task.category && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-500 shadow-sm">
                              {task.category.icon} {isRu ? task.category.nameRu : task.category.nameUz}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <TaskActions taskId={task.id} currentStatus={task.status} lang={user?.language || "uz"} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 py-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors" />
          <div className="text-7xl mb-8 animate-bounce">📭</div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10">
            {isRu ? "Задач пока нет" : "Hozircha vazifalar yo'q"}
          </h3>
          <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto relative z-10 leading-relaxed px-6">
            {isRu ? "Добавьте свою первую задачу и начните планировать день" : "Birinchi vazifangizni qo'shing va kunni rejalashtiring"}
          </p>
        </div>
      )}
    </div>
  )
}
