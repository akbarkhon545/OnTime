import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"
import { registerSchema } from "@/lib/validators"

const defaultCategories = [
  { nameUz: "Ish", nameRu: "Работа", color: "#6366F1", icon: "💼" },
  { nameUz: "O'qish", nameRu: "Учёба", color: "#8B5CF6", icon: "📚" },
  { nameUz: "Sport", nameRu: "Спорт", color: "#10B981", icon: "🏃" },
  { nameUz: "Shaxsiy", nameRu: "Личное", color: "#F59E0B", icon: "🏠" },
  { nameUz: "Sog'liq", nameRu: "Здоровье", color: "#EF4444", icon: "❤️" },
  { nameUz: "Boshqa", nameRu: "Другое", color: "#6B7280", icon: "📌" },
]

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email bilan foydalanuvchi allaqachon mavjud" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with default categories in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
        },
      })

      // Create default categories for new user
      await tx.category.createMany({
        data: defaultCategories.map((cat, index) => ({
          userId: newUser.id,
          nameUz: cat.nameUz,
          nameRu: cat.nameRu,
          color: cat.color,
          icon: cat.icon,
          sortOrder: index,
        })),
      })

      return newUser
    })

    return NextResponse.json(
      { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Xatolik yuz berdi" },
      { status: 500 }
    )
  }
}
