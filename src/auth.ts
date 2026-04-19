import NextAuth from "next-auth"
import prisma from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"

const defaultCategories = [
  { nameUz: "Ish", nameRu: "Работа", color: "#6366F1", icon: "💼" },
  { nameUz: "O'qish", nameRu: "Учёба", color: "#8B5CF6", icon: "📚" },
  { nameUz: "Sport", nameRu: "Спорт", color: "#10B981", icon: "🏃" },
  { nameUz: "Shaxsiy", nameRu: "Личное", color: "#F59E0B", icon: "🏠" },
  { nameUz: "Sog'liq", nameRu: "Здоровье", color: "#EF4444", icon: "❤️" },
  { nameUz: "Boshqa", nameRu: "Другое", color: "#6B7280", icon: "📌" },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign in — create or find user in our DB
      if (account?.provider === "google" && profile?.email) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          })

          if (!dbUser) {
            // Create new user from Google
            dbUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: (profile.name as string) || "User",
                avatarUrl: (profile.picture as string) || null,
                authProvider: "google",
                googleId: profile.sub,
              },
            })

            // Create default categories
            await prisma.category.createMany({
              data: defaultCategories.map((cat, index) => ({
                userId: dbUser!.id,
                nameUz: cat.nameUz,
                nameRu: cat.nameRu,
                color: cat.color,
                icon: cat.icon,
                sortOrder: index,
              })),
            })
          } else if (!dbUser.googleId) {
            // Link Google to existing email account
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                googleId: profile.sub,
                avatarUrl: dbUser.avatarUrl || (profile.picture as string),
              },
            })
          }

          // Store DB user id in the user object
          user.id = dbUser.id
        } catch (error) {
          console.error("Google sign-in error:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})
