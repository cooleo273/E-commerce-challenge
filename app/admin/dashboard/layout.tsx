

"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, BarChart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()
  // if (pathname === "/admin/login") {
  //   return children
  // }
  // if (!isAuthenticated && !pathname.includes("/admin/login")) {
  //   return null
  // }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}