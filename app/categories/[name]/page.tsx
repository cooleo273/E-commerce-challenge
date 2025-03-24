import { CategoryPage } from "@/components/category-page"
import { notFound } from "next/navigation"
import { getCategories, getProducts } from "@/lib/db"
import { Metadata } from "next"

interface CategoryPageProps {
  params: {
    name: string
  }
  searchParams: {
    minPrice?: string
    maxPrice?: string
    brands?: string
    size?: string
    search?: string
  }
}

interface Category {
  id: string
  name: string
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const categories = await getCategories()
  const category = categories.find(
    (cat: Category) => cat.name.toLowerCase() === resolvedParams.name.toLowerCase()
  )

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    }
  }

  return {
    title: `${category.name} Collection | BR Store`,
    description: `Explore our ${category.name.toLowerCase()} collection and find your perfect style.`,
  }
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const categories = await getCategories()
  const category = categories.find(
    (cat: Category) => cat.name.toLowerCase() === resolvedParams.name.toLowerCase()
  )

  if (!category) {
    notFound()
  }

  // Parse search params
  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined
  const brand = resolvedSearchParams.brands || undefined
  const size = resolvedSearchParams.size || undefined

  // Fetch products with filters
  const { products } = await getProducts({
    categoryId: category.id,
    minPrice,
    maxPrice,
    brand,
    size,
    limit: 24,
  })

  return (
    <CategoryPage
      title={category.name}
      description={`Explore our ${category.name.toLowerCase()} collection and find your perfect style.`}
      category={category.id}
      products={products}
    />
  )
}