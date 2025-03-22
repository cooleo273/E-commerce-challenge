export type SalesData = {
  date: string
  revenue: number
  orders: number
}

export type TopProduct = {
  id: string
  name: string
  soldQuantity: number
  revenue: number
}

export type UserStats = {
  totalUsers: number
  newUsers: number
  usersWithOrders: number
  conversionRate: number
}