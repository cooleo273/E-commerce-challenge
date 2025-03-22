"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Women" },
    { href: "/men", label: "Men" },
    { href: "/kids", label: "Kids" },
    { href: "/sports", label: "Sports" },
    { href: "/brands", label: "Brands" },
    { href: "/new", label: "New" },
    { href: "/sale", label: "Sale" },
  ]

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {routes.map((route) => {
        const isActive =
          route.href === "/" ? pathname === "/" : pathname === route.href || pathname.startsWith(`${route.href}/`)

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
                  : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

