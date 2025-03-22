import { notFound } from "next/navigation"
import { getProduct, getCategories, getBrands, getSizes, getColors } from "@/lib/db"
import ProductForm from "@/components/admin/product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories, brands, sizes, colors] = await Promise.all([
    getProduct(params.id),
    getCategories(),
    getBrands(),
    getSizes(),
    getColors(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.name}</h1>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProductForm product={product} categories={categories} brands={brands} sizes={sizes} colors={colors} />
        </div>
      </div>
    </div>
  )
}

