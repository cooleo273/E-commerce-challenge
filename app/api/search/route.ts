import { type NextRequest, NextResponse } from "next/server"
import { fuzzySearch } from "@/lib/search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const threshold = Number.parseFloat(searchParams.get("threshold") || "0.4")

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const results = await fuzzySearch(query, { limit, threshold })
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error performing search:", error)
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 })
  }
}

