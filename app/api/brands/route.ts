import { type NextRequest, NextResponse } from "next/server"
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    const brands = await getBrands()
    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admins can create brands
    await requireAdmin()

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 })
    }

    const brand = await createBrand({
      name: body.name,
      logo: body.logo,
    })

    return NextResponse.json(brand)
  } catch (error: any) {
    console.error("Error creating brand:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admins can update brands
    await requireAdmin()

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 })
    }

    const brand = await updateBrand(body.id, {
      name: body.name,
      logo: body.logo,
    })

    return NextResponse.json(brand)
  } catch (error: any) {
    console.error("Error updating brand:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admins can delete brands
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 })
    }

    await deleteBrand(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting brand:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}

