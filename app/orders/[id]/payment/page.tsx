import { notFound, redirect } from "next/navigation"
import { getOrder } from "@/lib/db"
import { getSession } from "@/lib/auth"
import ChapaCheckout from "@/components/chapa-checkout"

interface OrderPaymentPageProps {
  params: {
    id: string
  }
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    name: string;
  };
}

interface Order {
  userId: string;
  status: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
}

export default async function OrderPaymentPage({ params }: OrderPaymentPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const order = await getOrder(params.id) as Order | null

  if (!order) {
    notFound()
  }

  // Check if order belongs to the user
  if (order.userId !== session.id) {
    redirect("/orders")
  }

  // If order is already paid or not pending, redirect to order page
  if (order.status !== "PENDING") {
    redirect(`/orders/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="border-t border-b py-4 mb-4">
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                  </p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">${(order.total - order.shippingFee).toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping</p>
            <p className="font-medium">${order.shippingFee.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <p>Total</p>
            <p>${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <p className="mb-4">Please complete your payment using Chapa.</p>

        <ChapaCheckout orderId={params.id} />
      </div>
    </div>
  )
}

