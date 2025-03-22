import prisma from "./prisma"

interface PrismaOrderItem {
  id: string
  quantity: number
  price: number
  productId: string
  orderId: string
  size: string | null
  color: string | null
  createdAt: Date
  updatedAt: Date
}

// Update the interface to match Prisma's Order type
interface PrismaOrder {
  id: string
  orderNumber: string
  userId: string
  status: string
  total: number
  shippingFee: number
  shippingAddressId: string | null
  paymentMethod: string | null
  paymentIntentId: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  items?: PrismaOrderItem[]
}

// Get sales overview
export async function getSalesOverview(period: "day" | "week" | "month" | "year" = "month") {
  try {
    const now = new Date()
    let startDate: Date

    // Calculate start date based on period
    switch (period) {
      case "day":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get orders in the period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        items: true,
      },
    })

    // Calculate total sales with proper typing
    const totalRevenue = orders.reduce((sum: number, order: PrismaOrder) => 
      sum + order.total, 
      0
    )

    const totalItems = orders.reduce((sum: number, order: PrismaOrder) => {
      if (!order.items) return sum;
      const orderItems = order.items.reduce((itemSum: number, item: PrismaOrderItem) => 
        itemSum + item.quantity, 
        0
      )
      return sum + orderItems
    }, 0)

    // Get previous period for comparison
    let previousStartDate: Date
    const previousEndDate = new Date(startDate)

    switch (period) {
      case "day":
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(startDate.getDate() - 1)
        break
      case "week":
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(startDate.getMonth() - 1)
        break
      case "year":
        previousStartDate = new Date(startDate)
        previousStartDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // Get previous period orders
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate,
        },
        status: {
          not: "CANCELLED",
        },
      },
    })

    // Calculate previous period total sales
    const previousTotalSales = previousOrders.reduce((sum: number, order) => 
      sum + (typeof order.total === 'number' ? order.total : 0), 
      0
    )

    // Calculate growth rates
    const totalSales = totalRevenue
    const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0
    const itemsSold = totalItems
    
    const salesGrowth = previousTotalSales > 0 
      ? ((totalSales - previousTotalSales) / previousTotalSales) * 100 
      : 0
    
    const ordersGrowth = previousOrders.length > 0 
      ? ((orders.length - previousOrders.length) / previousOrders.length) * 100 
      : 0

    return {
      totalSales,
      orderCount: orders.length,
      averageOrderValue,
      itemsSold,
      salesGrowth,
      ordersGrowth,
    }
  } catch (error) {
    console.error("Error getting sales overview:", error)
    throw error
  }
}

// Get sales by time period
export async function getSalesByTimePeriod(period: "day" | "week" | "month" | "year" = "month", limit = 30) {
  try {
    const now = new Date()
    let startDate: Date
    let dateFormat: string

    // Calculate start date and format based on period
    switch (period) {
      case "day":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - limit)
        dateFormat = 'YYYY-MM-DD HH24:00:00'
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - limit * 7)
        dateFormat = 'YYYY-MM-DD'
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - limit)
        dateFormat = 'YYYY-MM-DD'
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        dateFormat = 'YYYY-MM'
        break
    }

    const salesData = await prisma.$queryRaw`
      SELECT
        TO_CHAR("createdAt", ${dateFormat}) as period,
        COALESCE(SUM(total), 0) as sales,
        COUNT(*) as orders
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
        AND status != 'CANCELLED'
      GROUP BY period
      ORDER BY period ASC
    `

    return salesData
  } catch (error) {
    console.error("Error getting sales by time period:", error)
    throw error
  }
}

// Get top selling products
export async function getTopSellingProducts(limit = 10) {
  try {
    // Get products with the most sales
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    })

    // Get product details
    const products = await Promise.all(
      topProducts.map(async (item: { 
        productId: string, 
        _sum: { quantity: number | null } 
      }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            category: true,
            brand: true,
          },
        })

        return {
          ...product,
          soldQuantity: item._sum.quantity ?? 0,
        }
      }),
    )

    return products
  } catch (error) {
    console.error("Error getting top selling products:", error)
    throw error
  }
}

// Get user statistics
export async function getUserStatistics() {
  try {
    // Get total user count
    const totalUsers = await prisma.user.count()

    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get users with orders
    const usersWithOrders = await prisma.order.groupBy({
      by: ["userId"],
      _count: true,
    })

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 ? (usersWithOrders.length / totalUsers) * 100 : 0

    return {
      totalUsers,
      newUsers,
      usersWithOrders: usersWithOrders.length,
      conversionRate,
    }
  } catch (error) {
    console.error("Error getting user statistics:", error)
    throw error
  }
}

interface Order {
  total: number
  items: OrderItem[]
  createdAt: Date
}

interface OrderItem {
  quantity: number
  price: number
  product: {
    id: string
    name: string
    category: {
      name: string
    }
  }
}

