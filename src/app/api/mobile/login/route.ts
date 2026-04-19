import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email va parol kiritilishi shart" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: "Email yoki parol noto'g'ri" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json({ message: "Email yoki parol noto'g'ri" }, { status: 401 })
    }

    // Generate JWT Token for mobile
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
    console.error("Mobile Login Error:", error)
    return NextResponse.json({ message: "Server xatoligi" }, { status: 500 })
  }
}
