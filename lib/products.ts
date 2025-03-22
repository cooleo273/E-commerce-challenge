import prisma from "./prisma"

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export const products = [
  {
    id: "1",
    name: "Running Shoe",
    description: "A comfortable running shoe for everyday use.",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    rating: 4.5,
    reviewCount: 25,
    discount: 10,
    isNew: true,
    inventory: 100,
    category: "sports",
    brand: "Nike",
    sizes: ["39", "40", "41", "42"],
    colors: [
      { name: "Red", value: "#EF4444" },
      { name: "Blue", value: "#3B82F6" },
    ],
  },
  {
    id: "2",
    name: "Casual T-Shirt",
    description: "A stylish t-shirt for casual wear.",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    rating: 4.2,
    reviewCount: 18,
    inventory: 150,
    category: "men",
    brand: "Adidas",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
    ],
  },
  {
    id: "3",
    name: "Kids Backpack",
    description: "A durable backpack for kids.",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    rating: 4.8,
    reviewCount: 32,
    isNew: true,
    inventory: 80,
    category: "kids",
    brand: "Puma",
    sizes: ["One Size"],
    colors: [
      { name: "Pink", value: "#EC4899" },
      { name: "Blue", value: "#3B82F6" },
    ],
  },
  {
    id: "4",
    name: "Women's Dress",
    description: "An elegant dress for women.",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    rating: 4.6,
    reviewCount: 22,
    discount: 20,
    inventory: 120,
    category: "women",
    brand: "Reebok",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Red", value: "#EF4444" },
    ],
  },
  {
    id: "5",
    name: "Training Shorts",
    description: "Comfortable shorts for training.",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150"],
    rating: 4.7,
    reviewCount: 40,
    inventory: 90,
    category: "sports",
    brand: "Adidas",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#6B7280" },
    ],
  },
  {
    id: "6",
    name: "Classic Sneakers",
    description: "Timeless sneakers for everyday style.",
    price: 69.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150"],
    rating: 4.4,
    reviewCount: 15,
    inventory: 75,
    category: "brands",
    brand: "Converse",
    sizes: ["37", "38", "39", "40", "41"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
    ],
  },
  {
    id: "7",
    name: "Running Jacket",
    description: "Lightweight jacket for running in all weather.",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150"],
    rating: 4.9,
    reviewCount: 55,
    isNew: true,
    inventory: 60,
    category: "sports",
    brand: "Nike",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blue", value: "#3B82F6" },
      { name: "Black", value: "#000000" },
    ],
  },
  {
    id: "8",
    name: "Leather Belt",
    description: "A stylish leather belt to complete your look.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=600",
    thumbnails: ["/placeholder.svg?height=100&width=150"],
    rating: 4.3,
    reviewCount: 28,
    inventory: 110,
    category: "men",
    brand: "Reebok",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Brown", value: "#A0522D" },
      { name: "Black", value: "#000000" },
    ],
  },
]


export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        reviews: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!products || products.length === 0) {
      return []
    }

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}