"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAuth } from "./auth-context"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
  color: string
  maxQuantity?: number // For stock management
  discountedPrice?: number // For sales
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => Promise<void>
  updateItemQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  subtotal: number
  total: number
  itemCount: number
  shipping: number
  tax: number
  isCartEmpty: boolean
  isMobile: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const SHIPPING_RATE = 10 // Base shipping rate
const TAX_RATE = 0.15 // 15% tax rate

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  // Add local storage cache
  useEffect(() => {
    const cachedCart = localStorage.getItem('cartItems')
    if (cachedCart) {
      setItems(JSON.parse(cachedCart))
      setLoading(false)
    }
  }, [])

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch cart from API with debounce
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }

    try {
      const response = await fetch("/api/cart", {
        cache: 'no-store' // Disable caching for fresh data
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }
      
      const data = await response.json()
      const cartData = Array.isArray(data) ? data : (data.items || [])
      
      const cartItems = cartData.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || "Product",
        price: item.product?.price || 0,
        image: item.product?.images?.[0] || "/placeholder.svg",
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        maxQuantity: item.product?.inventory,
        discountedPrice: item.product?.discount ? 
          item.product.price * (1 - item.product.discount / 100) : undefined
      }))
      
      setItems(cartItems)
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (error) {
      console.error("Error fetching cart:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Load cart when authentication state changes
  useEffect(() => {
    fetchCart()
  }, [isAuthenticated, fetchCart])

  // Add item to cart with optimistic update
  const addItem = async (newItem: Omit<CartItem, "id">) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to add items to cart")
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: newItem.productId,
          quantity: newItem.quantity,
          size: newItem.size,
          color: newItem.color
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      const data = await response.json()
      
      // Update local state with the actual server response
      setItems(prev => {
        const updated = [...prev, {
          id: data.id,
          ...newItem
        }]
        localStorage.setItem('cartItems', JSON.stringify(updated))
        return updated
      })

    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  // Update item quantity
  const updateItemQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to update cart")
    }

    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      const response = await fetch(`/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          itemId: id,
          quantity 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      await fetchCart(); // Refresh the cart after updating
    } catch (error) {
      console.error("Error updating item quantity:", error);
      throw error;
    }
  }

  // Remove item from cart
  const removeItem = async (id: string) => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to remove items from cart")
    }

    try {
      const response = await fetch(`/api/cart?itemId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCart(); // Refresh the cart after removing
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error("You must be logged in to clear cart")
    }

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  // Enhanced calculations
  const subtotal = items.reduce((sum, item) => 
    sum + (item.discountedPrice || item.price) * item.quantity, 0)

  const shipping = items.length > 0 ? SHIPPING_RATE : 0
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const isCartEmpty = items.length === 0

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        fetchCart,
        subtotal,
        total,
        itemCount,
        shipping,
        tax,
        isCartEmpty,
        isMobile
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

