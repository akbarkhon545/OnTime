import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Sarlavha bo'sh bo'lmasligi kerak"),
  description: z.string().optional(),
  taskDate: z.string().or(z.date()),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  categoryId: z.string().uuid().optional().nullable(),
})

export const registerSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
})

export const loginSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(1, "Parol kiritilishi shart"),
})
