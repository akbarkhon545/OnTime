import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { format } from "date-fns"
import { uz, ru } from "date-fns/locale"
import type { Prisma } from "@prisma/client"
import { getTranslation } from "@/lib/translations"

type TaskWithCategory = Prisma.TaskGetPayload<{
  include: { category: true }
}>

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)
  const locale = user?.language === "ru" ? ru : uz
  
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  const [totalTasks, completedTasks, pendingTasks, todayTasks, categories] = await Promise.all([
    prisma.task.count({ where: { userId: session.user.id } }),
    prisma.task.count({ where: { userId: session.user.id, status: "completed" } }),
    prisma.task.count({ where: { userId: session.user.id, status: "pending" } }),
    prisma.task.findMany({
      where: {
        userId: session.user.id,
        taskDate: { gte: startOfToday, lt: endOfToday },
      },
      include: { category: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { tasks: true } },
      },
    }),
  ])

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.welcomeBack}, {session.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          {format(today, "eeee, d-MMMM yyyy", { locale })}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard label={t.totalTasks} value={totalTasks} color="slate" icon="📋" />
        <StatCard label={t.completedTasks} value={completedTasks} color="emerald" icon="✅" />
        <StatCard label={t.pendingTasks} value={pendingTasks} color="amber" icon="⏳" />
        <StatCard label="Samaradorlik" value={`${completionRate}%`} color="indigo" icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-2xl">📅</span> {user?.language === "ru" ? "Планы на сегодня" : "Bugungi rejalar"}
              </h2>
              <a href="/tasks" className="text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-all hover:gap-2 flex items-center gap-1 group">
                {user?.language === "ru" ? "Смотреть все" : "Hammasini ko'rish"} <span className="transition-all group-hover:translate-x-1">→</span>
              </a>
            </div>

            {todayTasks.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {(todayTasks as TaskWithCategory[]).map((task) => (
                  <div key={task.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-5">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
                        style={{ backgroundColor: task.category?.color || "#CBD5E1" }}
                      />
                      <div>
                        <h3 className={`font-bold text-base transition-all ${task.status === "completed" ? "line-through text-slate-300" : "text-slate-800"}`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {task.startTime || "--:--"} — {task.endTime || "--:--"}
                          {task.category && ` · ${user?.language === "ru" ? task.category.nameRu : task.category.nameUz}`}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={task.status} lang={user?.language || "uz"} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="text-6xl mb-6 animate-bounce">🌤️</div>
                <p className="text-slate-400 font-bold text-lg">{t.noTasksToday}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick add CTA */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="text-xl font-bold mb-3 relative z-10">⚡ {user?.language === "ru" ? "Быстрая задача" : "Tez vazifa"}</h3>
            <p className="text-indigo-100 text-sm mb-6 font-medium relative z-10">
              {user?.language === "ru" ? "Добавьте новую задачу в ваш план" : "Bugungi rejangizga yangi vazifa qo'shing"}
            </p>
            <a
              href="/tasks"
              className="block w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-sm relative z-10"
            >
              + {t.addTask}
            </a>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🏷️</span> {t.categories}
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-bold text-slate-700">
                      {cat.icon} {user?.language === "ru" ? cat.nameRu : cat.nameUz}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded-lg group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                    {cat._count.tasks}
                  </span>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6 font-medium">{t.noCategories}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  const colorMap: Record<string, string> = {
    slate: "bg-white border-slate-100 text-slate-900 shadow-slate-200/50",
    emerald: "bg-emerald-50/50 border-emerald-100 text-emerald-700 shadow-emerald-200/30",
    amber: "bg-amber-50/50 border-amber-100 text-amber-700 shadow-amber-200/30",
    indigo: "bg-indigo-50/50 border-indigo-100 text-indigo-700 shadow-indigo-200/30",
  }

  return (
    <div className={`p-6 rounded-[2rem] border shadow-xl transition-all hover:-translate-y-1 duration-500 ${colorMap[color] || colorMap.slate}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black tracking-tight">{value}</p>
    </div>
  )
}

function StatusBadge({ status, lang }: { status: string; lang: string }) {
  const t = getTranslation(lang)
  const map: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", label: `✓ ${t.completed}` },
    in_progress: { bg: "bg-indigo-100", text: "text-indigo-700", label: `⟳ ${t.in_progress}` },
    pending: { bg: "bg-slate-100", text: "text-slate-600", label: `○ ${t.pending}` },
    cancelled: { bg: "bg-red-100", text: "text-red-600", label: `✕ ${t.cancelled}` },
  }

  const s = map[status] || map.pending

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}
