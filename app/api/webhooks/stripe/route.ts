import { type NextRequest, NextResponse } from "next/server"
import { handleWebhookEvent } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    const rawBody = await request.text()

    const result = await handleWebhookEvent(rawBody, signature)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const event = result.event

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Update order status if payment succeeded
        if (paymentIntent.metadata.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: { status: "PROCESSING" },
          })
        }

        break
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object

        // Update order status if payment failed
        if (failedPaymentIntent.metadata.orderId) {
          await prisma.order.update({
            where: { id: failedPaymentIntent.metadata.orderId },
            data: { status: "CANCELLED" },
          })
        }

        break
      // Handle other event types as needed
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

