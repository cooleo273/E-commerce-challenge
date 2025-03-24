import { type NextRequest, NextResponse } from "next/server"
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const id = searchParams.get("id")
    if (id) {
      const product = await getProduct(id)
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      return NextResponse.json(product)
    }

    const categoryId = searchParams.get("categoryId") || undefined
    const brand = searchParams.get("brand") || undefined
    const search = searchParams.get("search")
    // const sort = searchParams.get("sort")
    // const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    // const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const result = await getProducts({
      categoryId,
      brand,
      searchQuery: search || undefined,  // Convert null to undefined
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admins can create products
    await requireAdmin()

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.categoryId || !body.brandId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await createProduct({
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images || [],
      thumbnails: body.thumbnails || [],
      discount: body.discount,
      isNew: body.isNew,
      inventory: body.inventory || 0,
      categoryId: body.categoryId,
      brandId: body.brandId,
      sizeIds: body.sizeIds || [],
      colorIds: body.colorIds || [],
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error creating product:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update products
    await requireAdmin()

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await updateProduct(body.id, {
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images,
      thumbnails: body.thumbnails,
      discount: body.discount,
      isNew: body.isNew,
      inventory: body.inventory,
      categoryId: body.categoryId,
      brandId: body.brandId,
      sizeIds: body.sizeIds,
      colorIds: body.colorIds,
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error updating product:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admins can delete products
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    await deleteProduct(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting product:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

