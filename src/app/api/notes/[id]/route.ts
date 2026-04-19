import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const note = await prisma.note.findUnique({
    where: { id: params.id },
  })

  if (!note || note.userId !== session.user.id) {
    return new NextResponse("Not Found", { status: 404 })
  }

  await prisma.note.delete({
    where: { id: params.id },
  })

  return new NextResponse(null, { status: 204 })
}
