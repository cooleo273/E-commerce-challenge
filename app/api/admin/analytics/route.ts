import { type NextRequest, NextResponse } from "next/server"
import { getSalesOverview, getSalesByTimePeriod, getTopSellingProducts, getUserStatistics } from "@/lib/analytics"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Only admins can access analytics
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "overview"
    const period = (searchParams.get("period") || "month") as "day" | "week" | "month" | "year"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let data

    switch (type) {
      case "overview":
        data = await getSalesOverview(period)
        break
      case "sales":
        data = await getSalesByTimePeriod(period, limit)
        break
      case "products":
        data = await getTopSellingProducts(limit)
        break
      case "users":
        data = await getUserStatistics()
        break
      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching analytics:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

