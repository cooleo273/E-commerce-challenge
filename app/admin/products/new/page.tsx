import { getCategories, getBrands, getSizes, getColors } from "@/lib/db"
import ProductForm from "@/components/admin/product-form"

export default async function NewProductPage() {
  const [categories, brands, sizes, colors] = await Promise.all([getCategories(), getBrands(), getSizes(), getColors()])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py:5 sm:p-6">
          <ProductForm categories={categories} brands={brands} sizes={sizes} colors={colors} />
        </div>
      </div>
    </div>
  )
}

