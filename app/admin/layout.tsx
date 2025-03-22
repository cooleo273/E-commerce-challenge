"use client"
import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {!isLoginPage && <AdminSidebar />}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

