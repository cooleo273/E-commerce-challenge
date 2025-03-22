import { type NextRequest, NextResponse } from "next/server"
import { initializePayment, generateTxRef } from "@/lib/chapa"
import { getSession } from "@/lib/auth"
import { getCart } from "@/lib/db"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    // Get order details if orderId is provided
    let order
    let amount
    let items

    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      })

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Check if order belongs to the user
      if (order.userId !== session.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      amount = order.total
      items = order.items
    } else {
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
      amount = subtotal + shippingFee
      items = cart.items
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate transaction reference
    const txRef = generateTxRef("ORD")

    // Store transaction reference with order if orderId is provided
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentIntentId: txRef,
        },
      })
    }

    // Initialize payment
    const result = await initializePayment({
      amount,
      email: user.email,
      firstName: user.name?.split(" ")[0] || "Customer",
      lastName: user.name?.split(" ").slice(1).join(" ") || "User",
      txRef,
      callbackUrl: `${request.headers.get("origin") || "https://yourdomain.com"}/payment/callback`,
      customization: {
        title: "Purchase from Your Store",
        description: `Payment for ${items.length} item(s)`,
      },
      metadata: {
        userId: session.id,
        orderId: orderId || null,
      },
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      checkoutUrl: result.data.checkout_url,
      txRef,
      amount,
    })
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}

