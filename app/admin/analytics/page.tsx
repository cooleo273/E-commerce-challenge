import AnalyticsDashboard from "@/components/admin/analytics-dashboard"
import { getSalesByTimePeriod, getTopSellingProducts, getUserStatistics } from "@/lib/analytics"
import { SalesData, TopProduct, UserStats } from "@/types/analytics"

export default async function AnalyticsPage() {
  const [monthlySales, topProducts, userStats] = await Promise.all([
    getSalesByTimePeriod("month", 12) as Promise<SalesData[]>,
    getTopSellingProducts(10) as Promise<TopProduct[]>,
    getUserStatistics() as Promise<UserStats>, // Now matches the actual return type
  ])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <AnalyticsDashboard salesData={monthlySales} topProducts={topProducts} userStats={userStats} />
    </div>
  )
}

