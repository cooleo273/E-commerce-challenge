import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.review.deleteMany()
    await prisma.product.deleteMany()
    await prisma.size.deleteMany()
    await prisma.color.deleteMany()
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    // Create regular user
    const userPassword = await bcrypt.hash("password123", 10)
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        addresses: {
          create: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            isDefault: true,
          },
        },
      },
    })

    // Create cart for user
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    })

    // Create categories
    const categories = await Promise.all(
      ["women", "men", "kids", "sports", "brands", "new", "sale"].map((name) =>
        prisma.category.create({
          data: { name },
        }),
      ),
    )

    // Create brands
    const brands = await Promise.all(
      ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Converse", "Vans", "Asics", "Brooks"].map((name) =>
        prisma.brand.create({
          data: {
            name,
            logo: `/placeholder.svg?height=40&width=40`,
          },
        }),
      ),
    )

    // Create sizes
    const sizes = await Promise.all(
      ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"].map((name) =>
        prisma.size.create({
          data: { name },
        }),
      ),
    )

    // Create colors
    const colors = await Promise.all(
      [
        { name: "Black", value: "#000000" },
        { name: "White", value: "#FFFFFF" },
        { name: "Red", value: "#EF4444" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Green", value: "#10B981" },
        { name: "Yellow", value: "#F59E0B" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#6B7280" },
      ].map((color) =>
        prisma.color.create({
          data: color,
        }),
      ),
    )

    // Create sample products
    const sampleProducts = [
      {
        name: "Running Shoe",
        description: "A comfortable running shoe for everyday use.",
        price: 79.99,
        images: ["/placeholder.svg?height=400&width=600"],
        thumbnails: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
        discount: 10,
        isNew: true,
        inventory: 100,
        category: "sports",
        brand: "Nike",
        sizes: ["39", "40", "41", "42"],
        colors: ["Black", "Red"],
      },
      {
        name: "Casual Sneakers",
        description: "Stylish sneakers for casual wear.",
        price: 59.99,
        images: ["/placeholder.svg?height=400&width=600"],
        thumbnails: ["/placeholder.svg?height=100&width=150"],
        inventory: 75,
        category: "men",
        brand: "Adidas",
        sizes: ["40", "41", "42", "43", "44"],
        colors: ["White", "Blue"],
      },
      {
        name: "Kids Sport Shoes",
        description: "Comfortable sports shoes for kids.",
        price: 49.99,
        images: ["/placeholder.svg?height=400&width=600"],
        thumbnails: ["/placeholder.svg?height=100&width=150"],
        isNew: true,
        inventory: 50,
        category: "kids",
        brand: "Puma",
        sizes: ["36", "37", "38", "39"],
        colors: ["Blue", "Green"],
      },
      {
        name: "Women's Fashion Boots",
        description: "Stylish boots for women.",
        price: 89.99,
        images: ["/placeholder.svg?height=400&width=600"],
        thumbnails: ["/placeholder.svg?height=100&width=150"],
        discount: 15,
        inventory: 30,
        category: "women",
        brand: "Reebok",
        sizes: ["37", "38", "39", "40"],
        colors: ["Black", "Brown"],
      },
    ]

    for (const productData of sampleProducts) {
      // Find category and brand
      const category = categories.find((c) => c.name === productData.category)
      const brand = brands.find((b) => b.name === productData.brand)

      if (!category || !brand) continue

      // Find sizes
      const productSizes = sizes.filter((s) => productData.sizes.includes(s.name))

      // Find colors
      const productColors = colors.filter((c) => productData.colors.includes(c.name))

      // Create product
      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          images: productData.images,
          thumbnails: productData.thumbnails,
          discount: productData.discount,
          isNew: productData.isNew || false,
          inventory: productData.inventory,
          categoryId: category.id,
          brandId: brand.id,
          sizes: {
            connect: productSizes.map((size) => ({ id: size.id })),
          },
          colors: {
            connect: productColors.map((color) => ({ id: color.id })),
          },
        },
      })
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()

