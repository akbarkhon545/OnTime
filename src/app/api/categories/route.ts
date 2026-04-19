import { auth } from "@/auth"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

// GET all categories
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ message: "Xatolik" }, { status: 500 })
  }
}

// CREATE category
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { nameUz, nameRu, color, icon } = body

    if (!nameUz || !nameRu || !color) {
      return NextResponse.json(
        { message: "nameUz, nameRu va color maydonlari majburiy" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        userId: session.user.id,
        nameUz,
        nameRu,
        color,
        icon: icon || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
