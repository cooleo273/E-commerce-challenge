import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  try {
    if (!global.prisma) {
      global.prisma = new PrismaClient()
    }
    prisma = global.prisma
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error)
    throw error
  }
}

export default prisma

