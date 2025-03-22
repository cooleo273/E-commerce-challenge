import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await loginUser(email, password)

    return NextResponse.json({
      message: "Login successful",
      user,
    })
  } catch (error) {
    console.error("Login error:", error)
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

