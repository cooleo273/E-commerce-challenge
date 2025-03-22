import { type NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature, verifyTransaction } from "@/lib/chapa"
import prisma from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("chapa-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 })
    }

    const rawBody = await request.text()

    // Verify webhook signature
    const isValid = verifyWebhookSignature(signature, rawBody)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const { event, data } = payload

    // Handle different event types
    switch (event) {
      case "charge.completed":
        await handleSuccessfulPayment(data)
        break
      case "charge.failed":
        await handleFailedPayment(data)
        break
      // Handle other event types as needed
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(data: any) {
  const { tx_ref } = data

  // Verify the transaction
  const verification = await verifyTransaction(tx_ref)

  if (!verification.success) {
    console.error("Failed to verify transaction:", verification.error)
    return
  }

  // Find order by transaction reference
  const order = await prisma.order.findFirst({
    where: { paymentIntentId: tx_ref },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
    },
  })

  if (!order) {
    console.error("Order not found for transaction:", tx_ref)
    return
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PROCESSING" },
  })

  // Send order confirmation email
  if (order.user && order.user.email && order.shippingAddress) {
    await sendOrderConfirmation({
      email: order.user.email,
      name: order.user.name || "Customer",
      orderNumber: order.orderNumber,
      orderItems: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shippingAddress: {
        street: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
      },
    })
  }
}

async function handleFailedPayment(data: any) {
  const { tx_ref } = data

  // Find order by transaction reference
  const order = await prisma.order.findFirst({
    where: { paymentIntentId: tx_ref },
  })

  if (!order) {
    console.error("Order not found for transaction:", tx_ref)
    return
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "CANCELLED" },
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

