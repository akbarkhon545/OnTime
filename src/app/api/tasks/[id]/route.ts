import { auth } from "@/auth"
import prisma from "@/lib/db"
import { taskSchema } from "@/lib/validators"
import { NextResponse } from "next/server"

// GET single task
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  const { id } = await params

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
      include: { category: true, history: true },
    })

    if (!task) {
      return NextResponse.json({ message: "Vazifa topilmadi" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ message: "Xatolik" }, { status: 500 })
  }
}

// UPDATE task
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const validatedData = taskSchema.partial().parse(body)

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existingTask) {
      return NextResponse.json({ message: "Vazifa topilmadi" }, { status: 404 })
    }

    // If status is changing, record history
    if (body.status && body.status !== existingTask.status) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          oldStatus: existingTask.status,
          newStatus: body.status,
        },
      })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...validatedData,
        taskDate: validatedData.taskDate
          ? new Date(validatedData.taskDate)
          : undefined,
      },
    })

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// DELETE task
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  const { id } = await params

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!task) {
      return NextResponse.json({ message: "Vazifa topilmadi" }, { status: 404 })
    }

    await prisma.task.delete({ where: { id } })

    return NextResponse.json({ message: "Vazifa o'chirildi" })
  } catch (error) {
    return NextResponse.json({ message: "Xatolik" }, { status: 500 })
  }
}
