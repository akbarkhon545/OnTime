import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

// Sync tasks from mobile (offline -> online)
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const { tasks } = await req.json()

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { message: "tasks massiv bo'lishi kerak" },
        { status: 400 }
      )
    }

    const results = {
      created: 0,
      updated: 0,
      errors: 0,
    }

    for (const task of tasks) {
      try {
        if (task.localId) {
          // Check if task already exists by localId
          const existing = await prisma.task.findFirst({
            where: { localId: task.localId, userId: session.user.id },
          })

          if (existing) {
            // Update if mobile version is newer
            if (
              !existing.syncedAt ||
              new Date(task.updatedAt) > existing.syncedAt
            ) {
              await prisma.task.update({
                where: { id: existing.id },
                data: {
                  title: task.title,
                  description: task.description,
                  taskDate: new Date(task.taskDate),
                  startTime: task.startTime,
                  endTime: task.endTime,
                  priority: task.priority,
                  status: task.status,
                  categoryId: task.categoryId,
                  syncedAt: new Date(),
                },
              })
              results.updated++
            }
          } else {
            // Create new task
            await prisma.task.create({
              data: {
                userId: session.user.id,
                title: task.title,
                description: task.description,
                taskDate: new Date(task.taskDate),
                startTime: task.startTime,
                endTime: task.endTime,
                priority: task.priority,
                status: task.status || "pending",
                categoryId: task.categoryId,
                localId: task.localId,
                syncedAt: new Date(),
              },
            })
            results.created++
          }
        }
      } catch (e) {
        results.errors++
      }
    }

    // Return all tasks for this user (so mobile can update)
    const allTasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { taskDate: "desc" },
    })

    return NextResponse.json({
      message: "Sinxronizatsiya muvaffaqiyatli",
      results,
      tasks: allTasks,
    })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
