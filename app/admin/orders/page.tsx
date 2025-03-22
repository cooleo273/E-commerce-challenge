import Link from "next/link"
import { getAllOrders } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string }
}) {
  // Await the entire searchParams object
  const params = await Promise.resolve(searchParams)
  
  const page = Number(params?.page) || 1
  const search = params?.search || ""
  const status = params?.status || ""
  const limit = 10

  const { orders, total, pageCount } = await getAllOrders({
    search,
    status,
    limit,
    offset: (page - 1) * limit,
  })

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
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <form className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search orders..."
              defaultValue={search}
              className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <select
              name="status"
              defaultValue={status}
              className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.items.length} items</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.user.name || "No Name"}</div>
                  <div className="text-sm text-gray-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    href={`/admin/orders/${order.id}`} 
                    className="text-gray-900 hover:text-black transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> orders
          </div>
          <div className="flex space-x-3">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-black transition-colors"
              >
                Previous
              </Link>
            )}
            {page < pageCount && (
              <Link
                href={`/admin/orders?page=${page + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-900 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

