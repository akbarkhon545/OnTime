import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { language, timezone } = body

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(language && { language }),
        ...(timezone && { timezone }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
