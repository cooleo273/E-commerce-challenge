import { type NextRequest, NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/chapa"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const txRef = searchParams.get("tx_ref")

    if (!txRef) {
      return NextResponse.json({ error: "Transaction reference is required" }, { status: 400 })
    }

    // Verify the transaction
    const result = await verifyTransaction(txRef)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Find order by transaction reference
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: txRef },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if order belongs to the user
    if (order.userId !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check payment status
    const { status } = result.data

    // Update order status based on payment status
    if (status === "success") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" },
      })
    } else if (status === "failed") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      })
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: status,
      },
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

