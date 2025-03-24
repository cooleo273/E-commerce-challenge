import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verifyWebhookSignature, verifyTransaction } from "@/lib/chapa"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("x-chapa-signature")

    // Verify webhook signature
    if (!signature || !verifyWebhookSignature(signature, body)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    const payload = JSON.parse(body)
    const { tx_ref, status } = payload

    // Verify transaction status
    const verification = await verifyTransaction(tx_ref)
    
    if (!verification.success) {
      throw new Error("Transaction verification failed")
    }

    // Update order status
    const order = await prisma.order.update({
      where: { orderNumber: tx_ref },
      data: {
        status: status === "success" ? "PROCESSING" : "CANCELLED",
        paymentIntentId: verification.data?.reference,
      },
    })

    // Clear cart if payment successful
    if (status === "success") {
      await prisma.cart.delete({
        where: { userId: order.userId },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    )
  }
}