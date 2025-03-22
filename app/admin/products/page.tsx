import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/db"
import { Plus, Edit } from "lucide-react"
import DeleteProductButton from "@/components/admin/delete-product-button"
import { Product } from "@/types"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  // Properly await the searchParams
  const searchParamsData = await Promise.resolve(searchParams)
  const page = Number(searchParamsData?.page) || 1
  const search = searchParamsData?.search || ""
  const limit = 10

  const { products, total, pageCount } = await getProducts({
    search,
    limit,
    offset: (page - 1) * limit,
  })

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <form className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={search}
              className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
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
                Category
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
                Inventory
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
            {products.map((product: Product) => (
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
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category.name}</div>
                  <div className="text-sm text-gray-500">{product.brand.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  {product.discount && <div className="text-sm text-green-600">{product.discount}% off</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.inventory} in stock</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-3">
                    <Link 
                      href={`/admin/products/${product.id}`} 
                      className="text-gray-700 hover:text-black transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
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
            <span className="font-medium">{total}</span> products
          </div>
          <div className="flex space-x-3">
            {page > 1 && (
              <Link
                href={`/admin/products?page=${page - 1}${search ? `&search=${search}` : ""}`}
                className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-black transition-colors"
              >
                Previous
              </Link>
            )}
            {page < pageCount && (
              <Link
                href={`/admin/products?page=${page + 1}${search ? `&search=${search}` : ""}`}
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

