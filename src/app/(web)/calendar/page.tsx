import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"

export default async function CalendarPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Monday start

  // Shu oydagi barcha vazifalar
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

  // Kunlarga vazifalarni guruhlash
  const tasksByDay: Record<number, typeof tasks> = {}
  tasks.forEach((task) => {
    const day = new Date(task.taskDate).getDate()
    if (!tasksByDay[day]) tasksByDay[day] = []
    tasksByDay[day].push(task)
  })

  const daysInMonth = lastDay.getDate()
  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
  ]
  const weekDays = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">📅 Kalendar</h1>
        <p className="text-slate-500 text-sm mt-1">
          {monthNames[month]} {year} — oylik ko&apos;rinish
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bajarilgan
            </span>
            <span className="inline-flex items-center gap-1.5 ml-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Kutilmoqda
            </span>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {weekDays.map((d) => (
            <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: startWeekDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r border-slate-50 bg-slate-50/50" />
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
                className={`min-h-[100px] p-2 border-b border-r border-slate-50 transition-colors hover:bg-slate-50 ${
                  isToday ? "bg-indigo-50/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday ? "bg-indigo-600 text-white" : "text-slate-700"
                  }`}>
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {completedCount}/{dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task indicators */}
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                        task.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 line-through"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-slate-400 font-semibold px-1.5">
                      +{dayTasks.length - 3} ta
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
