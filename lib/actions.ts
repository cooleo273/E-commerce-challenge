import { getSession } from "@/lib/auth"
import { createOrder } from "@/lib/db/orders"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import { sendOrderConfirmation } from "@/lib/email"

interface OrderItem {
  product: {
    name: string
  }
  quantity: number
  price: number
}

export async function createOrderAction(formData: FormData) {
  try {
    const session = await getSession()

    if (!session) {
      return { success: false, error: "You must be logged in to place an order" }
    }

    // Get form data
    const shippingAddressId = formData.get("shippingAddressId") as string
    const paymentMethod = formData.get("paymentMethod") as string
    const notes = formData.get("notes") as string

    // Create the order
    const order = await createOrder({
      userId: session.id,
      shippingAddressId,
      paymentMethod,
      notes,
    })

    revalidatePath("/orders")
    revalidatePath("/cart")

    // If payment method is Chapa, redirect to payment page
    if (paymentMethod === "chapa") {
      redirect(`/orders/${order.id}/payment`)
    }

    // For other payment methods or COD, send confirmation email and redirect to order page
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true, email: true },
    })

    const address = await prisma.address.findUnique({
      where: { id: shippingAddressId },
    })

    if (user && user.email && address) {
      await sendOrderConfirmation({
        email: user.email,
        name: user.name || "Customer",
        orderNumber: order.orderNumber,
        orderItems: order.items.map((item: OrderItem) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state || undefined,  // Convert null to undefined
          zipCode: address.zipCode,
          country: address.country,
        },
      })
    }

    // Redirect to order confirmation page
    redirect(`/orders/${order.id}`)
  } catch (error: any) {
    console.error("Error creating order:", error)

    if (error.message === "Cart is empty") {
      return { success: false, error: "Your cart is empty" }
    }

    return { success: false, error: "Failed to create order" }
  }
}

