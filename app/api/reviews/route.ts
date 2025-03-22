import { type NextRequest, NextResponse } from "next/server"
import { createReview, updateReview, deleteReview } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const review = await createReview({
      userId: session.id,
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
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
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 })
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const review = await updateReview(body.id, {
      rating: body.rating,
      comment: body.comment,
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
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
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 })
    }

    await deleteReview(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}

