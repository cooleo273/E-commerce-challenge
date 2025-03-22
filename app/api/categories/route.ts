import { type NextRequest, NextResponse } from "next/server"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admins can create categories
    await requireAdmin()

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const category = await createCategory(body.name)

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error creating category:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update categories
    await requireAdmin()

    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json({ error: "Category ID and name are required" }, { status: 400 })
    }

    const category = await updateCategory(body.id, body.name)

    return NextResponse.json(category)
  } catch (error: any) {
    console.error("Error updating category:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admins can delete categories
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    await deleteCategory(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting category:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

