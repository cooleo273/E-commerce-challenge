import  prisma  from "../prisma"

interface CreateOrderParams {
  userId: string
  shippingAddressId: string
  paymentMethod: string
  notes?: string
}

export async function createOrder({
  userId,
  shippingAddressId,
  paymentMethod,
  notes,
}: CreateOrderParams) {
  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  })

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  )

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddressId,
      paymentMethod,
      notes,
      total,
      orderNumber: `ORD-${Date.now()}`,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  // Clear cart
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      items: {
        deleteMany: {},
      },
    },
  })

  return order
}