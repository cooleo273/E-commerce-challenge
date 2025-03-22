import { type NextRequest, NextResponse } from "next/server"
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await getAddresses(session.id)
    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.street || !body.city || !body.zipCode || !body.country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const address = await createAddress({
      userId: session.id,
      street: body.street,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      isDefault: body.isDefault,
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    const address = await updateAddress(body.id, {
      street: body.street,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      isDefault: body.isDefault,
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    await deleteAddress(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}

