import { NextResponse } from "next/server"
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

// GET /api/brands
export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}

// POST /api/brands
export async function POST(request: Request) {
  try {
    // Check admin authorization using requireAdmin
    await requireAdmin()

    const body = await request.json()
    const { name, logo } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const brand = await createBrand({ name: name.trim(), logo })
    return NextResponse.json(brand)
  } catch (error: any) {
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error creating brand:", error)
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 })
  }
}

// PUT /api/brands
export async function PUT(request: Request) {
  try {
    // Check admin authorization using requireAdmin
    await requireAdmin()

    const body = await request.json()
    const { id, name, logo } = body

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 })
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const brand = await updateBrand(id, { name: name.trim(), logo })
    return NextResponse.json(brand)
  } catch (error: any) {
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error updating brand:", error)
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
  }
}

// DELETE /api/brands
export async function DELETE(request: Request) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 })
    }

    await deleteBrand(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === "Brand not found") {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error deleting brand:", error)
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}