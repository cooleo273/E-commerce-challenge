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
    const { searchParams } = new URL(request.url)
    
    // Get and parse filter parameters
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const brand = searchParams.get("brands") || undefined
    const size = searchParams.get("size") || undefined
    
    // First get the category
    const categories = await getCategories()
    const category = categories.find(
      (cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (!category) {
      return NextResponse.json({ products: [] })
    }

    // Get products with all filters
    const { products } = await getProducts({
      categoryId: category.id,
      brand,
      minPrice,
      maxPrice,
      size,
      limit: 24,
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return NextResponse.json(
      { error: "Failed to fetch products by category" },
      { status: 500 }
    )
  }
}