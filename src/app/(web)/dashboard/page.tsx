import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { format } from "date-fns"
import { uz, ru } from "date-fns/locale"
import type { Prisma } from "@prisma/client"

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

  const greeting = user?.language === "ru" ? "Добро пожаловать" : "Xush kelibsiz"

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting}, {session.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {format(today, "eeee, d-MMMM yyyy", { locale })}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard label="Jami vazifalar" value={totalTasks} color="slate" icon="📋" />
        <StatCard label="Bajarilgan" value={completedTasks} color="emerald" icon="✅" />
        <StatCard label="Kutilayotgan" value={pendingTasks} color="amber" icon="⏳" />
        <StatCard label="Samaradorlik" value={`${completionRate}%`} color="indigo" icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">📅 Bugungi rejalar</h2>
              <a href="/tasks" className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors">
                Hammasini ko&apos;rish →
              </a>
            </div>

            {todayTasks.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {(todayTasks as TaskWithCategory[]).map((task) => (
                  <div key={task.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: task.category?.color || "#CBD5E1" }}
                      />
                      <div>
                        <h3 className={`font-semibold text-sm ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {task.startTime || "--:--"} — {task.endTime || "--:--"}
                          {task.category && ` · ${task.category.nameUz}`}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="text-5xl mb-4">🌤️</div>
                <p className="text-slate-400 mb-1">Bugun uchun rejalar hali yo&apos;q</p>
                <p className="text-slate-300 text-sm">Yangi vazifa qo&apos;shish uchun &quot;Vazifalar&quot; sahifasiga o&apos;ting</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick add CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-bold mb-2">⚡ Tez vazifa</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Bugungi rejangizga yangi vazifa qo&apos;shing
            </p>
            <a
              href="/tasks"
              className="block w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-center shadow-sm hover:bg-indigo-50 transition-all text-sm"
            >
              + Vazifa qo&apos;shish
            </a>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">🏷️ Kategoriyalar</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-slate-700">
                      {cat.icon} {cat.nameUz}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat._count.tasks}
                  </span>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Kategoriyalar yo&apos;q</p>
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
    slate: "bg-slate-50 border-slate-200 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  }

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color] || colorMap.slate}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", label: "✓ Bajarildi" },
    in_progress: { bg: "bg-indigo-100", text: "text-indigo-700", label: "⟳ Jarayonda" },
    pending: { bg: "bg-slate-100", text: "text-slate-600", label: "○ Kutilmoqda" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", label: "✕ Bekor" },
  }

  const s = map[status] || map.pending

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  )
}
