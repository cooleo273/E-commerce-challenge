"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product-grid"

interface Product {
  id: string
  name: string
  price: number
  // ... other product properties
}

export function CategoryProducts({ categoryId }: { categoryId: string }) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const brands = searchParams.get("brands")
      const size = searchParams.get("size")

      const queryParams = new URLSearchParams({
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(brands && { brands }),
        ...(size && { size }),
      })

      try {
        const response = await fetch(`/api/categories/${categoryId}?${queryParams}`)
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId, searchParams])

  if (loading) {
    return <div>Loading...</div>
  }

  return <ProductGrid products={products} />
}