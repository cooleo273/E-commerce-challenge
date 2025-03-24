import { CategoryPage } from "@/components/category-page"
import { notFound } from "next/navigation"
import { getCategories, getProducts } from "@/lib/db"
import { Metadata } from "next"

interface CategoryPageProps {
  params: {
    name: string
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

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categories = await getCategories()
  const category = categories.find(
    (cat: Category) => cat.name.toLowerCase() === resolvedParams.name.toLowerCase()
  )

  if (!category) {
    notFound()
  }

  // Fetch products for this category
  const { products } = await getProducts({
    categoryId: category.id,
    limit: 24,
  })

  // Add console.log to debug
  console.log(`Found ${products.length} products for category ${category.name}`)

  return (
    <CategoryPage
      title={category.name}
      description={`Explore our ${category.name.toLowerCase()} collection and find your perfect style.`}
      category={category.id}
      products={products} // Make sure we're passing the products array
    />
  )
}