import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getTranslation } from "@/lib/translations"
import { NotesList } from "./notes-list"

export default async function NotesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)
  const isRu = user?.language === "ru"

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">📝 {t.notes}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {isRu ? "Ваши важные мысли и идеи" : "Muhim fikrlar va g'oyalar"}
          </p>
        </div>
      </div>

      <NotesList initialNotes={notes} lang={user?.language || "uz"} />
    </div>
  )
}
