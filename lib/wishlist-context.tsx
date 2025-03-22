"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "./auth-context"

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "id">) => Promise<void>
  removeItem: (id: string) => Promise<void>
  fetchWishlist: () => Promise<void>
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { isAuthenticated } = useAuth()

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    // Skip fetching if not authenticated
    if (!isAuthenticated) {
      setItems([])
      return
    }

    try {
      const response = await fetch("/api/wishlist")
      
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }
      
      const data = await response.json()
      
      // Transform the data to match our WishlistItem interface
      const wishlistItems = data.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || "Product",
        price: item.product?.price || 0,
        image: item.product?.images?.[0] || "/placeholder.svg",
      }))
      
      setItems(wishlistItems)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      // Set empty array on error instead of throwing
      setItems([])
    }
  }

  // Load wishlist when authentication state changes
  useEffect(() => {
    fetchWishlist().catch(console.error)
  }, [isAuthenticated])

  // Add item to wishlist
  const addItem = async (newItem: Omit<WishlistItem, "id">) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to add items to wishlist")
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: newItem.productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to wishlist");
      }

      await fetchWishlist(); // Refresh the wishlist after adding
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      throw error;
    }
  }

  // Remove item from wishlist
  const removeItem = async (id: string) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to remove items from wishlist")
    }

    try {
      const response = await fetch(`/api/wishlist?productId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      await fetchWishlist(); // Refresh after removing
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      throw error;
    }
  }

  // Clear wishlist
  const clearWishlist = () => {
    if (!isAuthenticated) {
      return; // Silently return if not authenticated
    }
    setItems([])
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  // Calculate total number of items
  const itemCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        itemCount,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

