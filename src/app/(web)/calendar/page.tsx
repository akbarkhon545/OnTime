import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getTranslation } from "@/lib/translations"

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)
  const isRu = user?.language === "ru"

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Monday start

  // Fetch tasks for this month
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      taskDate: {
        gte: firstDay,
        lte: lastDay,
      },
    },
    include: { category: true },
  })

  // Group tasks by day
  const tasksByDay: Record<number, typeof tasks> = {}
  tasks.forEach((task) => {
    const day = new Date(task.taskDate).getDate()
    if (!tasksByDay[day]) tasksByDay[day] = []
    tasksByDay[day].push(task)
  })

  const daysInMonth = lastDay.getDate()
  const monthNames = t.months
  const weekDays = t.weekDays

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">📅 {t.calendar}</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {monthNames[month]} {year} — {isRu ? "ежемесячный обзор" : "oylik ko'rinish"}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-2xl font-black text-slate-900">
            {monthNames[month]} <span className="text-indigo-600">{year}</span>
          </h2>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> {t.completed}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" /> {t.pending}
            </span>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-white">
          {weekDays.map((d) => (
            <div key={d} className="py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 bg-slate-50/20">
          {/* Empty cells before first day */}
          {Array.from({ length: startWeekDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r border-slate-100 bg-slate-100/20" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = day === now.getDate() && month === now.getMonth()
            const dayTasks = tasksByDay[day] || []
            const completedCount = dayTasks.filter((t) => t.status === "completed").length

            return (
              <div
                key={day}
                className={`min-h-[120px] p-3 border-b border-r border-slate-100 transition-all hover:bg-white hover:z-10 hover:shadow-xl group ${
                  isToday ? "bg-indigo-50/30" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : "text-slate-700 group-hover:text-indigo-600"
                  }`}>
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-black text-slate-300">
                      {completedCount}/{dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task indicators */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`text-[9px] px-2 py-1 rounded-lg truncate font-bold uppercase tracking-tight shadow-sm transition-all hover:scale-105 ${
                        task.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 line-through border border-emerald-100"
                          : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[9px] text-slate-400 font-black px-2 mt-1 uppercase tracking-widest">
                      +{dayTasks.length - 3} {isRu ? "та" : "ta"}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
