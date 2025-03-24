"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { getProductById } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

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

export function WishlistItems() {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your wishlist...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-red-500">{error}</h2>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">Save items you love to your wishlist.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {wishlistItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4"
          data-wishlist-id={item.id}
          data-wishlist-product-id={item.productId}
        >
          <div className="w-full sm:w-40 h-40 relative">
            <Image
              src={item.product?.images?.[0] || "/placeholder.svg"}
              alt={item.product?.name || "Product"}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="font-medium text-lg">{item.product?.name}</h3>
            <p className="font-bold mt-2">
              ${(item.product?.price || 0).toFixed(2)}
            </p>
            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
              <Button className="sm:w-auto" onClick={() => handleAddToCart(item.productId)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="sm:w-auto" onClick={() => handleRemoveItem(item.productId)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}