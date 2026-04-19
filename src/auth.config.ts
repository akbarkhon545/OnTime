import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// Bu fayl faqat Middleware uchun xizmat qiladi va juda yengil bo'lishi kerak.
// Bu yerda Prisma yoki bcrypt import qilinmaydi!

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      // Credentials provayderi middleware uchun kerak, lekin authorize 
      // bu yerda ishlamaydi (u auth.ts da bo'ladi)
      authorize: () => null 
    })
  ],
} satisfies NextAuthConfig
