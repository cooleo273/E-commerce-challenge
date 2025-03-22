import { type NextRequest, NextResponse } from "next/server"
import { getSearchSuggestions } from "@/lib/search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], categories: [], brands: [] })
    }

    const suggestions = await getSearchSuggestions(query, limit)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return NextResponse.json({ error: "Failed to get search suggestions" }, { status: 500 })
  }
}

