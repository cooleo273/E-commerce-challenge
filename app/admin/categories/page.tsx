import Link from "next/link"
import { getCategories } from "@/lib/db"
import { Plus } from "lucide-react"
import CategoryList from "@/components/admin/category-list"
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoriesPage() {
  noStore()
  
  try {
    const categories = await getCategories()

    if (!categories || categories.length === 0) {
      console.log('No categories found or empty response')
    }

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
  } catch (error) {
    console.error('Error loading categories:', error)
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading categories. Please try refreshing the page.
        </div>
      </div>
    )
  }
}

