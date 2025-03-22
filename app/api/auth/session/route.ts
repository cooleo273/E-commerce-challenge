import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    console.log("Session request received, returning:", session ? "authenticated session" : "no session")

    if (!session) {
      return NextResponse.json({ authenticated: false, message: "No valid session found" })
    }

    // Return the session with an authenticated flag for easier client-side checks
    return NextResponse.json({
      ...session,
      authenticated: true
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ 
      authenticated: false, 
      error: "Session verification failed",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

