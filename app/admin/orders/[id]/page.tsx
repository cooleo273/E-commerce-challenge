import { notFound } from "next/navigation"
import Image from "next/image"
import { getOrder } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import UpdateOrderStatus from "@/components/admin/update-order-status"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  // Helper function to get status badge color
  function getStatusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
          <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg?height=40&width=40"}
                              alt={item.product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Subtotal
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(order.total - order.shippingFee).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Shipping
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.shippingFee.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total
                    </th>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Notes</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Customer and shipping info */}
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.user.name || "No Name"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod}</dd>
                </div>
                {order.paymentIntentId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.paymentIntentId}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Address</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <address className="not-italic text-sm text-gray-900">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </address>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

