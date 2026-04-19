import { auth } from "@/auth"
import prisma from "@/lib/db"
import { taskSchema } from "@/lib/validators"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ message: "Xatolik" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = taskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        taskDate: new Date(validatedData.taskDate),
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
