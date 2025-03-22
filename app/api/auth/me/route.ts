import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Session error" }, { status: 500 })
  }
}