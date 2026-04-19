import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json()

    if (!idToken) {
      return NextResponse.json({ message: "ID Token kiritilmishi shart" }, { status: 400 })
    }

    // Google Token'ni tekshirish (Google API orqali)
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
    const payload = await googleRes.json()

    if (!payload || payload.error) {
      return NextResponse.json({ message: "Google token noto'g'ri" }, { status: 401 })
    }

    const { email, name, picture, sub: googleId } = payload

    // Foydalanuvchini bazadan qidirish yoki yaratish
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          image: picture,
          // Google orqali kirganlar uchun parol shart emas
        },
      })
    }

    // Mobil uchun JWT Token yaratish
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.AUTH_SECRET || "fallback-secret",
      { expiresIn: "30d" }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Mobile Google Login Error:", error)
    return NextResponse.json({ message: "Server xatoligi" }, { status: 500 })
  }
}
