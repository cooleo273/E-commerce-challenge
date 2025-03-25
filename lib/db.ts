import prisma from "./prisma"
import {
  getCachedProduct,
  getCachedProducts,
  getCachedCategories,
  getCachedBrands,
  invalidateProductCache,
  invalidateAllProductCaches,
  invalidateCategoryCache,
  invalidateBrandCache,
} from "./cache"

// Products
// Get products with caching
// export async function getProducts(
//   options: {
//     category?: string | null
//     brand?: string | null
//     search?: string | null
//     minPrice?: number
//     maxPrice?: number
//     sort?: string | null
//     limit?: number
//     offset?: number
//   } = {},
// ) {
//   // Create a cache key based on the options
//   const cacheKey = `products:${JSON.stringify(options)}`

//   return getCachedProducts(cacheKey, async () => {
//     // Your existing getProducts implementation
//     const { category, brand, search, minPrice, maxPrice, sort = "newest", limit = 20, offset = 0 } = options

//     const where: any = {}

//     if (category) {
//       where.category = {
//         name: category,
//       }
//     }

//     if (brand) {
//       where.brand = {
//         name: brand,
//       }
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ]
//     }

//     if (minPrice !== undefined) {
//       where.price = {
//         ...where.price,
//         gte: minPrice,
//       }
//     }

//     if (maxPrice !== undefined) {
//       where.price = {
//         ...where.price,
//         lte: maxPrice,
//       }
//     }

//     let orderBy: any = { createdAt: "desc" }

//     if (sort === "price-asc") {
//       orderBy = { price: "asc" }
//     } else if (sort === "price-desc") {
//       orderBy = { price: "desc" }
//     } else if (sort === "rating") {
//       orderBy = { rating: "desc" }
//     } else if (sort === "popularity") {
//       orderBy = { reviewCount: "desc" }
//     }

//     const [products, total] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         orderBy,
//         take: limit,
//         skip: offset,
//         include: {
//           category: true,
//           brand: true,
//           sizes: true,
//           colors: true,
//         },
//       }),
//       prisma.product.count({ where }),
//     ])

//     return {
//       products,
//       total,
//       pageCount: Math.ceil(total / limit),
//       currentPage: Math.floor(offset / limit) + 1,
//     }
//   })
// }
export async function getProducts({
  categoryId,
  searchQuery,
  brand,
  minPrice,
  maxPrice,
  size,
  limit = 24,
  offset = 0,
}: {
  categoryId?: string
  searchQuery?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  limit?: number
  offset?: number
}) {
  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          brand ? { brandId: brand } : {},
          minPrice !== undefined ? { price: { gte: minPrice } } : {},
          maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
          size ? { sizes: { some: { name: size } } } : {},
          searchQuery ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
      take: limit,
      skip: offset,
      include: {
        category: true,
        brand: true,
        sizes: true,
      },
    }),
    prisma.product.count({
      where: {
        AND: [
          categoryId ? { categoryId } : {},
          brand ? { brandId: brand } : {},
          minPrice !== undefined ? { price: { gte: minPrice } } : {},
          maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
          size ? { sizes: { some: { name: size } } } : {},
          searchQuery ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
    }),
  ])

  return { products, count }
}
export async function getProduct(id: string) {
  return getCachedProduct(id, async () => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
  })
}

// Update the createProduct function to invalidate caches
export async function createProduct(data: {
  name: string
  description?: string
  price: number
  images: string[]
  thumbnails: string[]
  discount?: number
  isNew?: boolean
  inventory: number
  categoryId: string
  brandId: string
  sizeIds: string[]
  colorIds: string[]
}) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images,
      thumbnails: data.thumbnails,
      discount: data.discount,
      isNew: data.isNew,
      inventory: data.inventory,
      categoryId: data.categoryId,
      brandId: data.brandId,
      sizes: {
        connect: data.sizeIds.map((id) => ({ id })),
      },
      colors: {
        connect: data.colorIds.map((id) => ({ id })),
      },
    },
    include: {
      category: true,
      brand: true,
      sizes: true,
      colors: true,
    },
  })

  // Invalidate caches
  invalidateAllProductCaches()
  invalidateCategoryCache()
  invalidateBrandCache()

  return product
}

// Update the updateProduct function to invalidate caches
export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    images?: string[]
    thumbnails?: string[]
    discount?: number | null
    isNew?: boolean
    inventory?: number
    categoryId?: string
    brandId?: string
    sizeIds?: string[]
    colorIds?: string[]
  },
) {
  const updateData: any = { ...data }

  // Handle relationships separately
  delete updateData.sizeIds
  delete updateData.colorIds

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...updateData,
      ...(data.sizeIds && {
        sizes: {
          set: data.sizeIds.map((id) => ({ id })),
        },
      }),
      ...(data.colorIds && {
        colors: {
          set: data.colorIds.map((id) => ({ id })),
        },
      }),
    },
    include: {
      category: true,
      brand: true,
      sizes: true,
      colors: true,
    },
  })

  // Invalidate caches
  invalidateProductCache(id)
  invalidateAllProductCaches()

  return product
}

// Update the deleteProduct function to invalidate caches
export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  })

  // Invalidate caches
  invalidateProductCache(id)
  invalidateAllProductCaches()
}

// Categories
// Get categories with caching
export async function getCategories() {
  return getCachedCategories(async () => {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })
  })
}

export async function createCategory(name: string) {
  return prisma.category.create({
    data: { name },
  })
}

export async function updateCategory(id: string, name: string) {
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  })

  // Invalidate the categories cache
  invalidateCategoryCache()

  return category
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  })
}

// Brands
// Get brands with caching
export async function getBrands() {
  return getCachedBrands(async () => {
    return prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })
  })
}

export async function createBrand(data: { name: string; logo?: string }) {
  return prisma.brand.create({
    data,
  })
}

export async function updateBrand(id: string, data: { name?: string; logo?: string }) {
  return prisma.brand.update({
    where: { id },
    data,
  })
}

export async function deleteBrand(id: string) {
  try {
    // First check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id },
    })

    if (!brand) {
      throw new Error("Brand not found")
    }

    // If brand exists, delete it
    await prisma.brand.delete({
      where: { id },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Brand not found") {
      throw error
    }
    throw new Error("Failed to delete brand")
  }
}

// Sizes
export async function getSizes() {
  return prisma.size.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function createSize(name: string) {
  return prisma.size.create({
    data: { name },
  })
}

export async function updateSize(id: string, name: string) {
  return prisma.size.update({
    where: { id },
    data: { name },
  })
}

export async function deleteSize(id: string) {
  await prisma.size.delete({
    where: { id },
  })
}

// Colors
export async function getColors() {
  return prisma.color.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export async function createColor(data: { name: string; value: string }) {
  return prisma.color.create({
    data,
  })
}

export async function updateColor(id: string, data: { name?: string; value?: string }) {
  return prisma.color.update({
    where: { id },
    data,
  })
}

export async function deleteColor(id: string) {
  await prisma.color.delete({
    where: { id },
  })
}

// Related products
export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: productId,
      },
    },
    take: limit,
    include: {
      category: true,
      brand: true,
    },
  })
}

// Cart
export async function getCart(userId: string) {
  // 1. First, check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    // Handle the error:  The user doesn't exist.  You might want to:
    //    -  Create the user first.
    //    -  Return an error to the client.
    //    -  Throw an exception.
    console.error(`User with ID ${userId} not found.`);
    //  Important:  You MUST handle this error.  Here's a basic example that returns an error:
    return null; // Or throw an error, or create a new user.  This is CRITICAL.
  }

  // 2. Now, get the cart.
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              colors: true,
              sizes: true,
            },
          },
        },
      },
    },
  });

  // 3. Create the cart if it doesn't exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                colors: true,
                sizes: true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
}


export async function addToCart(
  userId: string,
  data: {
    productId: string
    quantity: number
    size?: string
    color?: string
  },
) {
  const { productId, quantity, size, color } = data

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error("Product not found")
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    })
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      size,
      color,
    },
  })

  if (existingItem) {
    // Update existing item
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    })
  }

  // Create new item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      size,
      color,
    },
  })
}

export async function updateCartItem(id: string, quantity: number) {
  return prisma.cartItem.update({
    where: { id },
    data: { quantity },
  })
}

export async function removeCartItem(id: string) {
  return prisma.cartItem.delete({
    where: { id },
  })
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })
  }
}

// Orders
export async function createOrder(data: {
  userId: string
  shippingAddressId: string
  paymentMethod: string
  paymentIntentId?: string
  notes?: string
}) {
  const { userId, shippingAddressId, paymentMethod, paymentIntentId, notes } = data

  // Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  // Calculate total with proper type safety
  const subtotal = cart.items.reduce(
    (sum, item) => {
      const price = item.product.price;
      const discount = item.product.discount || 0;
      const discountedPrice = price * (1 - discount / 100);
      return sum + discountedPrice * item.quantity;
    }, 
    0
  );

  // Apply shipping fee (free for orders over $100)
  const shippingFee = subtotal >= 100 ? 0 : 10;
  const total = parseFloat((subtotal + shippingFee).toFixed(2));

  // Create order with a unique order number that includes a random component
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderNumber = `ORD-${Date.now()}-${randomStr}`;

  try {
    return await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          total,
          shippingFee,
          shippingAddressId,
          paymentMethod,
          paymentIntentId,
          notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: parseFloat((item.product.price * (1 - (item.product.discount || 0) / 100)).toFixed(2)),
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Update product inventory
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { inventory: true },
        });
        
        if (!product) continue;
        
        // Prevent negative inventory
        const newInventory = Math.max(0, product.inventory - item.quantity);
        
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: newInventory },
        });
      }

      return order;
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
    },
  })
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
) {
  return prisma.order.update({
    where: { id },
    data: { status },
  })
}

export async function getAllOrders(
  options: {
    status?: string | null;
    search?: string | null;
    sort?: string | null;
    limit?: number;
    offset?: number
  } = {},
) {
  const { status, search, sort = "newest", limit = 20, offset = 0 } = options

  const where: any = {}

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ]
  }

  let orderBy: any = { createdAt: "desc" }

  if (sort === "oldest") {
    orderBy = { createdAt: "asc" }
  } else if (sort === "total-desc") {
    orderBy = { total: "desc" }
  } else if (sort === "total-asc") {
    orderBy = { total: "asc" }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    total,
    pageCount: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  }
}

// Wishlist
export async function getWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          brand: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function addToWishlist(userId: string, productId: string) {
  // Check if already in wishlist
  const existing = await prisma.wishlistItem.findFirst({
    where: {
      userId,
      productId,
    },
  })

  if (existing) {
    return existing
  }

  return prisma.wishlistItem.create({
    data: {
      userId,
      productId,
    },
  })
}

export async function removeFromWishlist(id: string) {
  return prisma.wishlistItem.delete({
    where: { id },
  })
}

export async function isInWishlist(userId: string, productId: string) {
  const item = await prisma.wishlistItem.findFirst({
    where: {
      userId,
      productId,
    },
  })

  return !!item
}

// Users
export async function getUsers(
  options: {
    search?: string | null
    role?: string | null
    sort?: string | null
    limit?: number
    offset?: number
  } = {},
) {
  const { search, role, sort = "newest", limit = 20, offset = 0 } = options

  const where: any = {}

  if (role) {
    where.role = role
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  let orderBy: any = { createdAt: "desc" }

  if (sort === "oldest") {
    orderBy = { createdAt: "asc" }
  } else if (sort === "name") {
    orderBy = { name: "asc" }
  } else if (sort === "email") {
    orderBy = { email: "asc" }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    total,
    pageCount: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  }
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  })
}

export async function updateUser(
  id: string,
  data: {
    name?: string
    email?: string
    password?: string
    image?: string
    role?: "USER" | "ADMIN"
  },
) {
  const updateData: any = { ...data }

  // Hash password if provided
  if (updateData.password) {
    const bcrypt = require("bcryptjs")
    updateData.password = await bcrypt.hash(updateData.password, 10)
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })
}

// Addresses
export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  })
}

export async function createAddress(data: {
  userId: string
  street: string
  city: string
  state?: string
  zipCode: string
  country: string
  isDefault?: boolean
}) {
  // If this is the default address, unset any existing default
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId: data.userId,
        isDefault: true,
      },
      data: { isDefault: false },
    })
  }

  return prisma.address.create({
    data,
  })
}

export async function updateAddress(
  id: string,
  data: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    isDefault?: boolean
  },
) {
  // If this is being set as default, unset any existing default
  if (data.isDefault) {
    const address = await prisma.address.findUnique({
      where: { id },
    })

    if (address) {
      await prisma.address.updateMany({
        where: {
          userId: address.userId,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }
  }

  return prisma.address.update({
    where: { id },
    data,
  })
}

export async function deleteAddress(id: string) {
  await prisma.address.delete({
    where: { id },
  })
}

// Reviews
export async function createReview(data: {
  userId: string
  productId: string
  rating: number
  comment?: string
}) {
  const review = await prisma.review.create({
    data,
  })

  // Update product rating
  await updateProductRating(data.productId)

  return review
}

export async function updateReview(
  id: string,
  data: {
    rating?: number
    comment?: string
  },
) {
  const review = await prisma.review.update({
    where: { id },
    data,
    include: { product: true },
  })

  // Update product rating
  await updateProductRating(review.productId)

  return review
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
  })

  if (!review) {
    throw new Error("Review not found")
  }

  await prisma.review.delete({
    where: { id },
  })

  // Update product rating
  await updateProductRating(review.productId)
}

async function updateProductRating(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
  })

  if (reviews.length === 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: 0,
        reviewCount: 0,
      },
    })
    return
  }

  const totalRating = reviews.reduce((sum: number, review: {rating: number}) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  })
}

