import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { title, content, color } = body

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title,
      content,
      color: color || "#ffffff",
    },
  })

  return NextResponse.json(note)
}
