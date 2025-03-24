import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { initializePayment } from "@/lib/chapa"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, email, firstName, lastName, txRef, items } = body

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: txRef,
        userId: session.id,
        status: "PENDING",
        total: parseFloat(amount),
        shippingFee: amount > 100 ? 0 : 10,
        paymentMethod: "CHAPA",
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
            size: item.size,
            color: item.color,
          })),
        },
      },
    })

    // Initialize Chapa payment
    const payment = await initializePayment({
      amount,
      currency: "ETB",
      email,
      firstName,
      lastName,
      txRef,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      customization: {
        title: "BR Store", // Shortened to meet 16-character limit
        description: `Order ${txRef}`,
      },
      metadata: {
        orderId: order.id,
      },
    })

    if (!payment.success) {
      console.error("Payment initialization failed:", payment.error)
      return NextResponse.json(
        { error: payment.error || "Payment initialization failed" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: payment.checkoutUrl,
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    )
  }
}