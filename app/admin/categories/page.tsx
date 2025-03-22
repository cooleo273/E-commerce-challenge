import Link from "next/link"
import { getCategories } from "@/lib/db"
import { Plus } from "lucide-react"
import CategoryList from "@/components/admin/category-list"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <CategoryList categories={categories} />
      </div>
    </div>
  )
}

