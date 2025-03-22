"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface AnalyticsDashboardProps {
  salesData: any[]
  topProducts: any[]
  userStats: any
}

export default function AnalyticsDashboard({ salesData, topProducts, userStats }: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState("month")

  // Format sales data for charts
  const formattedSalesData = salesData.map((item) => ({
    name: item.period,
    sales: Number.parseFloat(item.sales),
    orders: Number.parseInt(item.orders),
  }))

  // Format top products data for charts
  const topProductsChartData = topProducts.map((product) => ({
    name: product.name,
    value: product.soldQuantity,
  }))

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
    "#A4DE6C",
    "#D0ED57",
  ]

  return (
    <div className="space-y-6">
      {/* Sales Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your sales performance over time</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedSalesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Sales ($)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products and User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProductsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topProductsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 max-h-[200px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.soldQuantity} units
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Customer acquisition and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Total Users", value: userStats.totalUsers },
                    { name: "New Users (30d)", value: userStats.newUsers },
                    { name: "Customers", value: userStats.usersWithOrders },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                <p className="text-2xl font-semibold">{userStats.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Users who made a purchase</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">New User Growth</h3>
                <p className="text-2xl font-semibold">
                  {userStats.totalUsers > 0
                    ? `${((userStats.newUsers / userStats.totalUsers) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

