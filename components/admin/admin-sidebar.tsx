"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Tag, Palette } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Brands", href: "/admin/brands", icon: Palette },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col h-screen">
      <div className="flex flex-col h-full bg-white border-r">
        <div className="flex items-center flex-shrink-0 px-6 py-5 border-b">
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        
        <div className="flex flex-col justify-between flex-1">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? "bg-black text-white" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t">
            <button
              onClick={logout}
              className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut 
                className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-red-500" 
                aria-hidden="true" 
              />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

