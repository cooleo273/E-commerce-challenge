import { getSalesOverview, getTopSellingProducts, getUserStatistics } from "@/lib/analytics"
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TopProduct, SalesOverview, UserStats } from "@/types/dashboard"

export default async function AdminDashboard() {
  // Fetch dashboard data with type annotations
  const [overview, topProducts, userStats] = await Promise.all([
    getSalesOverview("month") as Promise<SalesOverview>,
    getTopSellingProducts(5) as Promise<TopProduct[]>,
    getUserStatistics() as Promise<UserStats>,
  ])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-black/5 text-black">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${overview.totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Similar updates for other stat cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <p className="text-2xl font-semibold">{overview.orderCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <p className="text-2xl font-semibold">{userStats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products Sold</p>
              <p className="text-2xl font-semibold">{overview.itemsSold}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
          <Link href="/admin/products" className="text-sm text-black hover:text-gray-600 transition-colors">
            View all products →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category.name}</div>
                    <div className="text-sm text-gray-500">{product.brand.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.soldQuantity} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity and user stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Updated stat cards */}
            <div className="p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white text-black">
                  <Users className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-xl font-bold text-gray-900">{userStats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* ... other stat cards with similar styling ... */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/products/new" 
              className="flex items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all hover:border-black">
              <div className="p-2 rounded-lg bg-black text-white">
                <Package className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Add New Product</p>
                <p className="text-xs text-gray-500">Create a new product listing</p>
              </div>
            </Link>

            {/* Similar updates for other action links */}
            <Link href="/admin/orders" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Manage Orders</p>
                <p className="text-xs text-gray-500">View and update order status</p>
              </div>
            </Link>

            <Link href="/admin/customers" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">View Customers</p>
                <p className="text-xs text-gray-500">Manage customer accounts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

