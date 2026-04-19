import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"

export default async function CategoriesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">🏷️ Kategoriyalar</h1>
          <p className="text-slate-500 text-sm mt-1">Vazifalaringizni tartibga soling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const total = cat._count.tasks
          const completed = cat.tasks.length
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon || "📁"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{cat.nameUz}</h3>
                  <p className="text-xs text-slate-400">{cat.nameRu}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{completed}/{total} bajarildi</span>
                  <span className="font-bold" style={{ color: cat.color }}>{percent}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-slate-400">{cat.color}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  {total} vazifa
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 py-20 text-center">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Kategoriyalar yo&apos;q</h3>
          <p className="text-slate-400 text-sm">
            Ro&apos;yxatdan o&apos;tganingizda avtomatik yaratiladi
          </p>
        </div>
      )}
    </div>
  )
}
