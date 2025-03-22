import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const user = await registerUser({ name, email, password })

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

