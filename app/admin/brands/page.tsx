import Link from "next/link"
import { getBrands } from "@/lib/db"
import { Plus } from "lucide-react"
import BrandList from "@/components/admin/brand-list"

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <BrandList brands={brands} />
      </div>
    </div>
  )
}

