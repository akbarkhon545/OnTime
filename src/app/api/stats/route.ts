import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

// GET stats
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") || "today" // today | week | month

  const now = new Date()
  let startDate: Date

  switch (period) {
    case "week":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    default: // today
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  try {
    const [total, completed, pending, inProgress, cancelled] = await Promise.all([
      prisma.task.count({
        where: { userId: session.user.id, taskDate: { gte: startDate } },
      }),
      prisma.task.count({
        where: {
          userId: session.user.id,
          taskDate: { gte: startDate },
          status: "completed",
        },
      }),
      prisma.task.count({
        where: {
          userId: session.user.id,
          taskDate: { gte: startDate },
          status: "pending",
        },
      }),
      prisma.task.count({
        where: {
          userId: session.user.id,
          taskDate: { gte: startDate },
          status: "in_progress",
        },
      }),
      prisma.task.count({
        where: {
          userId: session.user.id,
          taskDate: { gte: startDate },
          status: "cancelled",
        },
      }),
    ])

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return NextResponse.json({
      period,
      total,
      completed,
      pending,
      inProgress,
      cancelled,
      completionRate,
    })
  } catch (error) {
    return NextResponse.json({ message: "Xatolik" }, { status: 500 })
  }
}
