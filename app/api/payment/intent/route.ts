import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/stripe"
import { getSession } from "@/lib/auth"
import { getCart } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get cart to calculate total
    const cart = await getCart(session.id)

    // Calculate total
    interface CartItem {
      product: {
        price: number;
        discount?: number | null;
      };
      quantity: number;
    }

    const subtotal = cart.items.reduce((sum: number, item: CartItem) => {
      const price = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + price * item.quantity;
    }, 0);

    // Apply shipping fee (free for orders over $100)
    const shippingFee = subtotal > 100 ? 0 : 10
    const total = subtotal + shippingFee

    // Create payment intent
    const result = await createPaymentIntent(total, {
      userId: session.id,
      cartId: cart.id,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      amount: total,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

