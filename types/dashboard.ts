export type TopProduct = {
  id: string
  name: string
  images: string[]
  category: {
    name: string
  }
  brand: {
    name: string
  }
  price: number
  soldQuantity: number
}

export type SalesOverview = {
  totalSales: number
  orderCount: number
  itemsSold: number
}

export type UserStats = {
  totalUsers: number
  newUsers: number
  usersWithOrders: number
  conversionRate: number
}