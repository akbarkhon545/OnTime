import prisma from "../src/lib/db"

const defaultCategories = [
  { nameUz: "Ish", nameRu: "Работа", color: "#6366F1", icon: "💼" },
  { nameUz: "O'qish", nameRu: "Учёба", color: "#8B5CF6", icon: "📚" },
  { nameUz: "Sport", nameRu: "Спорт", color: "#10B981", icon: "🏃" },
  { nameUz: "Shaxsiy", nameRu: "Личное", color: "#F59E0B", icon: "🏠" },
  { nameUz: "Sog'liq", nameRu: "Здоровье", color: "#EF4444", icon: "❤️" },
  { nameUz: "Boshqa", nameRu: "Другое", color: "#6B7280", icon: "📌" },
]

async function main() {
  console.log("Seeding default categories...")

  // Note: These will be created per-user when they register
  console.log("Default categories template ready:")
  defaultCategories.forEach((cat) => {
    console.log(`  ${cat.icon} ${cat.nameUz} / ${cat.nameRu} (${cat.color})`)
  })

  console.log("\nSeed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export { defaultCategories }
