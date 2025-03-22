import { type NextRequest, NextResponse } from "next/server"
import { getUsers, getUser, updateUser, deleteUser } from "@/lib/db"
import { getSession, requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // If requesting a specific user
    if (id) {
      // Regular users can only view their own profile
      if (session.role !== "ADMIN" && id !== session.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const user = await getUser(id)

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(user)
    }

    // Only admins can list all users
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get users with pagination and filters
    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const sort = searchParams.get("sort")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const result = await getUsers({
      search,
      role,
      sort,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
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
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Regular users can only update their own profile
    // And they cannot change their role
    if (session.role !== "ADMIN" && (body.id !== session.id || body.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const user = await updateUser(body.id, {
      name: body.name,
      email: body.email,
      password: body.password,
      image: body.image,
      role: body.role,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admins can delete users
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting user:", error)

    if (error.message === "Forbidden" || error.message === "Unauthorized") {
      return NextResponse.json({ error: error.message }, { status: error.message === "Forbidden" ? 403 : 401 })
    }

    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

