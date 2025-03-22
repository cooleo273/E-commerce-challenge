import { type NextRequest, NextResponse } from "next/server"
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cart = await getCart(session.id)

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
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
    if (!body.productId || !body.quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cartItem = await addToCart(session.id, {
      productId: body.productId,
      quantity: body.quantity,
      size: body.size,
      color: body.color,
    })
    console.log(cartItem)

    const updatedCart = await getCart(session.id)

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.itemId || !body.quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cartItem = await updateCartItem(body.itemId, body.quantity)

    const updatedCart = await getCart(session.id)

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")
    const clearAll = searchParams.get("clear") === "true"

    if (clearAll) {
      await clearCart(session.id)
    } else if (itemId) {
      await removeCartItem(itemId)
    } else {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const updatedCart = await getCart(session.id)

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}

