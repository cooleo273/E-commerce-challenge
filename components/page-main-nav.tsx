"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageMainNavProps {
  className?: string
}

export function PageMainNav({ className }: PageMainNavProps) {
  const pathname = usePathname()

  const routes = [
    { href: "/new", label: "New Arrivals" },
    { href: "/sale", label: "Sale" },
    { href: "/brands", label: "Brands" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {routes.map((route) => {
        const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary"
                : route.href === "/sale"
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}