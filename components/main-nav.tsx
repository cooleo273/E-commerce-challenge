"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

interface Category {
  id: string
  name: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {categories.map((category) => {
        const href = `/categories/${category.name.toLowerCase()}`
        const isActive = pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={category.id}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {category.name}
          </Link>
        )
      })}
    </nav>
  )
}