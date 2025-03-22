"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ChapaCheckoutProps {
  orderId: string
}

export default function ChapaCheckout({ orderId }: ChapaCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleCheckout() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment")
      }

      // Redirect to Chapa checkout page
      window.location.href = data.checkoutUrl
    } catch (error: any) {
      console.error("Error initializing payment:", error)
      setError(error.message || "Failed to initialize payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <Button onClick={handleCheckout} disabled={isLoading} className="w-full py-3 bg-green-600 hover:bg-green-700">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay with Chapa"
        )}
      </Button>

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  )
}

