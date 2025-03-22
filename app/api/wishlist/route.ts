import { type NextRequest, NextResponse } from "next/server"
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wishlist = await getWishlist(session.id)
    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const wishlistItem = await addToWishlist(session.id, body.productId)
    return NextResponse.json(wishlistItem)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the request has a body
    let productId;
    try {
      const body = await request.json();
      productId = body.productId;
    } catch {
      // If no body, try to get from search params
      const { searchParams } = new URL(request.url);
      productId = searchParams.get("productId");
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get the wishlist item ID for this product
    const wishlist = await getWishlist(session.id);
    const wishlistItem = wishlist.find(item => item.productId === productId);
    
    if (!wishlistItem) {
      return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 })
    }

    await removeFromWishlist(wishlistItem.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

