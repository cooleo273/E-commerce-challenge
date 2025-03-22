import { type NextRequest, NextResponse } from "next/server"
import { getWishlist } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ inWishlist: false }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const wishlist = await getWishlist(session.id)
    
    // Check if the product is in the wishlist
    const inWishlist = wishlist.some(item => item.productId === productId)
    
    return NextResponse.json({ inWishlist })
  } catch (error) {
    console.error("Error checking wishlist status:", error)
    return NextResponse.json({ error: "Failed to check wishlist status" }, { status: 500 })
  }
}