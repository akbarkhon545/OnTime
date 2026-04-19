import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const { id } = await params

  const note = await prisma.note.findUnique({
    where: { id },
  })

  if (!note || note.userId !== session.user.id) {
    return new NextResponse("Not Found", { status: 404 })
  }

  await prisma.note.delete({
    where: { id },
  })

  return new NextResponse(null, { status: 204 })
}
