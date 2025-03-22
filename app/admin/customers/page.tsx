import Link from "next/link"
import Image from "next/image"
import { getUsers } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; role?: string }
}) {
  // Await the searchParams object
  const params = await Promise.resolve(searchParams)
  
  const page = Number(params?.page) || 1
  const search = params?.search || ""
  const role = params?.role || ""
  const limit = 10

  const { users, total, pageCount } = await getUsers({
    search,
    role,
    limit,
    offset: (page - 1) * limit,
  })

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <form className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search customers..."
              defaultValue={search}
              className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <select
              name="role"
              defaultValue={role}
              className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="">All Roles</option>
              <option value="USER">Customers</option>
              <option value="ADMIN">Admins</option>
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

      {/* Customers table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Orders
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.image ? (
                        <Image
                          src={user.image || "/placeholder.svg"}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name || "No Name"}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._count.orders}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/customers/${user.id}`} className="text-blue-600 hover:text-blue-900">
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
            <span className="font-medium">{total}</span> customers
          </div>
          <div className="flex space-x-3">
            {page > 1 && (
              <Link
                href={`/admin/customers?page=${page - 1}${search ? `&search=${search}` : ""}${role ? `&role=${role}` : ""}`}
                className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-black transition-colors"
              >
                Previous
              </Link>
            )}
            {page < pageCount && (
              <Link
                href={`/admin/customers?page=${page + 1}${search ? `&search=${search}` : ""}${role ? `&role=${role}` : ""}`}
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

