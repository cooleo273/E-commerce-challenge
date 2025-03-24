import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCart } from "@/lib/db"
import { initializePayment } from "@/lib/chapa"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get cart to calculate total
    const cart = await getCart(session.id)

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      )
    }

    // Calculate total
    const subtotal = cart.items.reduce((sum: number, item: CartItem) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    // Apply shipping fee (free for orders over $100)
    const shippingFee = subtotal > 100 ? 0 : 10
    const total = subtotal + shippingFee

    // Initialize Chapa payment
    const payment = await initializePayment({
      amount: total,
      currency: "ETB",
      email: session.email,
      firstName: session.name?.split(" ")[0] || "",
      lastName: session.name?.split(" ").slice(1).join(" ") || "",
      txRef: `order-${Date.now()}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/chapa/webhook`,
      metadata: {
        userId: session.id,
        cartId: cart.id,
      },
    })

    if (!payment.success) {
      return NextResponse.json(
        { error: payment.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: payment.checkoutUrl,
    })

  } catch (error: any) {
    console.error("Payment intent error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    )
  }
}

interface CartItem {
  product: {
    price: number;
    discount?: number | null;
  };
  quantity: number;
}

