"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function verifyPayment() {
      try {
        const txRef = searchParams.get("tx_ref")
        if (!txRef) {
          setStatus("failed")
          setError("Transaction reference not found")
          return
        }

        const response = await fetch(`/api/payment/verify?tx_ref=${txRef}`)
        const data = await response.json()

        if (!response.ok) {
          setStatus("failed")
          setError(data.error || "Failed to verify payment")
          return
        }

        if (data.order) {
          setOrderId(data.order.id)
          if (data.order.paymentStatus === "success") {
            setStatus("success")
          } else {
            setStatus("failed")
            setError("Payment was not successful")
          }
        } else {
          setStatus("failed")
          setError("Order not found")
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error)
        setStatus("failed")
        setError(error.message || "Failed to verify payment")
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-gray-500 mb-4">Please wait while we verify your payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">
              Your payment has been processed successfully. Thank you for your purchase!
            </p>
            <div className="space-y-3 w-full">
              <Button onClick={() => router.push(`/orders/${orderId}`)} className="w-full">
                View Order
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-2">We couldn't process your payment.</p>
            {error && <p className="text-red-500 mb-6">{error}</p>}
            <div className="space-y-3 w-full">
              {orderId && (
                <Button onClick={() => router.push(`/orders/${orderId}`)} className="w-full">
                  Try Again
                </Button>
              )}
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}