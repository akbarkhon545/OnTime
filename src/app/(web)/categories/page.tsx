import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getTranslation } from "@/lib/translations"

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)
  const isRu = user?.language === "ru"

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { tasks: true } },
      tasks: {
        where: { status: "completed" },
        select: { id: true },
      },
    },
  })

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">📂 {t.categories}</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          {isRu ? "Организуйте свои задачи по категориям" : "Vazifalaringizni tartibga soling"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const total = cat._count.tasks
          const completed = cat.tasks.length
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div
              key={cat.id}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Background gradient hint */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: cat.color }}
              />

              <div className="flex items-center gap-5 mb-8">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 duration-500"
                  style={{ backgroundColor: cat.color + "15", color: cat.color }}
                >
                  {cat.icon || "📁"}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-black text-slate-800 text-lg truncate">
                    {isRu ? cat.nameRu : cat.nameUz}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.color}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {completed}/{total} {isRu ? "выполнено" : "bajarildi"}
                  </span>
                  <span className="text-sm font-black" style={{ color: cat.color }}>{percent}%</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {isRu ? "Задачи" : "Vazifalar"}
                </span>
                <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  {total}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 py-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mt-32 blur-3xl opacity-50" />
          <div className="text-7xl mb-8 animate-pulse">📁</div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10">{t.noCategories}</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto relative z-10">
            {isRu ? "Категории создаются автоматически при регистрации" : "Kategoriyalar ro'yxatdan o'tganingizda avtomatik yaratiladi"}
          </p>
        </div>
      )}
    </div>
  )
}
