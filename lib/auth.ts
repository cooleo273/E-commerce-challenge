import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import prisma from "./prisma"

// Use a more secure secret key and ensure it's required
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

export type UserSession = {
  id: string
  email: string
  name: string | null
  role: string
}

// Register a new user
export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  const { name, email, password } = data

  if (!email.includes("@") || password.length < 8) {
    throw new Error("Invalid email or password too short")
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }, // Normalize email
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 12) // Increased rounds for better security

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(), // Store normalized email
      password: hashedPassword,
      role: "USER",
    },
  })

  // Create cart in a transaction to ensure both operations succeed
  await prisma.$transaction([
    prisma.cart.create({
      data: {
        userId: user.id,
      },
    })
  ])

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new Error("Invalid credentials")
  }

  // Create session
  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  // Create JWT token with explicit encoding and expiration
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET))

  // Set cookie with more specific options
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    priority: "high"
  })

  return session
}

// Logout user
export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

// Get current user session
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) return null

    const verified = await jwtVerify(
      token, 
      new TextEncoder().encode(JWT_SECRET),
      {
        maxTokenAge: "7d",
        algorithms: ["HS256"]  // Explicitly specify the algorithm
      }
    )

    // Validate the session structure
    const payload = verified.payload as UserSession
    if (!payload.id || !payload.email || !payload.role) {
      throw new Error("Invalid session structure")
    }

    return payload
  } catch (error) {
    // Clear invalid session and log the error
    console.error("Session verification error:", error)
    const cookieStore = await cookies()
    cookieStore.delete("session")
    return null
  }
}

// Verify request has valid session
export async function verifyAuth(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(
      token, 
      new TextEncoder().encode(JWT_SECRET),
      {
        maxTokenAge: "7d",
        algorithms: ["HS256"]
      }
    )

    const payload = verified.payload as UserSession
    if (!payload.id || !payload.email || !payload.role) {
      return null
    }

    return payload
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

// Add a new function for admin session verification
export async function verifyAdminAuth(req: NextRequest) {
  const session = await verifyAuth(req)
  if (!session || session.role !== "ADMIN") {
    return null
  }
  return session
}

// Check if user is admin
export async function isAdmin() {
  const session = await getSession()
  return session?.role === "ADMIN"
}

// Middleware to require authentication
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session
}

// Middleware to require admin role
export async function requireAdmin() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    throw new Error("Forbidden")
  }

  return session
}


// export async function createSession(userId: string) {
//   return prisma.user.create({
//     data: {
//       id: nanoid(),
//       userId,
//       expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
//     },
//   })
// }

// export async function getSession() {
//   const sessionId = cookies().get("session_id")?.value
  
//   if (!sessionId) {
//     return null
//   }
  
//   const session = await prisma.session.findUnique({
//     where: { id: sessionId },
//     include: { user: true },
//   })
  
//   if (!session || session.expires < new Date()) {
//     // Session expired
//     if (session) {
//       await deleteSession(sessionId)
//     }
//     cookies().delete("session_id")
//     return null
//   }
  
//   return {
//     id: session.id,
//     userId: session.userId,
//     user: session.user,
//   }
// }

// export async function deleteSession(sessionId: string) {
//   return prisma.session.delete({
//     where: { id: sessionId },
//   })
// }

// export async function getCurrentUser() {
//   const session = await getSession()
  
//   if (!session) {
//     return null
//   }
  
//   return session.user
// }
// ```

