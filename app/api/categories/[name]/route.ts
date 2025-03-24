import { type NextRequest, NextResponse } from "next/server"
import { getProducts, getCategories } from "@/lib/db"

interface Category {
  id: string
  name: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const categoryName = params.name
    console.log('Searching for category:', categoryName)
    
    // First get the category
    const categories = await getCategories()
    const category = categories.find(
      (cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (!category) {
      console.log('No category found')
      return NextResponse.json({ products: [] })
    }

    // Get products filtered by categoryId
    const { products } = await getProducts({
      categoryId: category.id,
      limit: 24,
    })
    console.log(`Found ${products.length} products for category ${category.name}`)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return NextResponse.json(
      { error: "Failed to fetch products by category" },
      { status: 500 }
    )
  }
}