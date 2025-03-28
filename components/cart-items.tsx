"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { generateTxRef } from "@/lib/chapa"

// Create a separate component for the part that uses useSearchParams
function CartItemsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { items, updateItemQuantity, removeItem, subtotal, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const shipping = subtotal > 100 ? 0 : 10
  
  // Check for payment success parameter
  const paymentSuccess = searchParams.get("payment_success")
  
  // Clear cart if payment was successful
  useEffect(() => {
    if (paymentSuccess === "true") {
      clearCart();
    }
  }, [paymentSuccess, clearCart]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart")
      return
    }

    setIsLoading(true)
    try {
      const txRef = generateTxRef("BR")
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: (subtotal + shipping).toFixed(2),
          email: user?.email,
          firstName: user?.name?.split(" ")[0] || "",
          lastName: user?.name?.split(" ").slice(1).join(" ") || "",
          txRef,
          items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment")
      }

      // Store the cart state in localStorage before redirecting
      localStorage.setItem("pendingPayment", "true")
      
      // Redirect to Chapa checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm">
        <div className="flex justify-center mb-6">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-medium mb-4 text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love!
        </p>
        <Button asChild className="bg-black hover:bg-gray-800 text-white px-8 py-6 h-auto rounded-lg font-medium">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <p className="text-gray-500 mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              {/* ... table header and items ... */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-6 text-gray-500 font-medium">Product</th>
                  <th className="text-center p-6 text-gray-500 font-medium">Quantity</th>
                  <th className="text-right p-6 text-gray-500 font-medium">Price</th>
                  <th className="p-6 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    {/* ... item details ... */}
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                          <div className="flex gap-4 mt-1">
                            {item.size && (
                              <p className="text-sm text-gray-500">Size: <span className="font-medium">{item.size}</span></p>
                            )}
                            {item.color && (
                              <p className="text-sm text-gray-500">Color: <span className="font-medium">{item.color}</span></p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none border-r"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                            }}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="h-9 w-14 rounded-none text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            readOnly
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none border-l"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-white border rounded-xl p-8 space-y-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <span className="text-lg">Total</span>
                <span className="text-lg">${(subtotal + shipping).toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-medium text-base transition-colors disabled:opacity-50"
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center justify-center">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Main component that wraps the content in Suspense
export function CartItems() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartItemsContent />
    </Suspense>
  )
}