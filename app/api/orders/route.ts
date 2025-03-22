import { type NextRequest, NextResponse } from "next/server"
import { getOrders, getOrder, createOrder, updateOrderStatus, getAllOrders } from "@/lib/db"
import { getSession, requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // Admin can view all orders or specific order
    if (session.role === "ADMIN") {
      if (id) {
        const order = await getOrder(id)
        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }
        return NextResponse.json(order)
      }

      // Get all orders with pagination
      const status = searchParams.get("status")
      const search = searchParams.get("search")
      const sort = searchParams.get("sort")
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Number.parseInt(searchParams.get("limit") || "20")
      const offset = (page - 1) * limit

      const result = await getAllOrders({
        status,
        search,
        sort,
        limit,
        offset,
      })

      return NextResponse.json(result)
    }

    // Regular user can only view their own orders
    if (id) {
      const order = await getOrder(id)

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      // Check if the order belongs to the user
      if (order.userId !== session.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      return NextResponse.json(order)
    }

    const orders = await getOrders(session.id)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
    if (!body.shippingAddressId || !body.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await createOrder({
      userId: session.id,
      shippingAddressId: body.shippingAddressId,
      paymentMethod: body.paymentMethod,
      paymentIntentId: body.paymentIntentId,
      notes: body.notes,
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error creating order:", error)

    if (error.message === "Cart is empty") {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update order status
    await requireAdmin()

    const body = await request.json()

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    const order = await updateOrderStatus(body.id, body.status)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error updating order:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

