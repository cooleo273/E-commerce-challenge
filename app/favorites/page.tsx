"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { getProductById } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

import { WishlistItems } from "@/components/wishlist-items"

// Define the interface for wishlist items
interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    description?: string
  }
}

export default function FavoritesPage() {
  const { removeItem } = useWishlist()
  const { addItem: addToCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true)
        // Fetch wishlist items directly
        const response = await fetch("/api/wishlist")
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist")
        }
        const data = await response.json()
        setWishlistItems(data)
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        setError("Failed to load your wishlist. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const handleAddToCart = async (productId: string) => {
    try {
      const product = await getProductById(productId)

      if (product) {
        addToCart({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.images?.[0] || "/placeholder.svg",
          quantity: 1,
          size: "default",
          color: "default",
        })

        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
      toast({
        title: "Item removed",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-2xl">
            BR<span className="text-primary">.</span>
          </Link>
          <MainNav className="mx-6" />
          
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <WishlistItems />
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="container px-4">
          <p className="text-sm text-muted-foreground text-center">© 2025 BR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

