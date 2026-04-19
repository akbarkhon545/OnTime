import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { getTranslation } from "@/lib/translations"
import { WebShell } from "./components/web-shell"

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const t = getTranslation(user?.language)

  return (
    <WebShell session={session} t={t}>
      {children}
    </WebShell>
  )
}
