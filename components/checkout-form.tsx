"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Load Stripe outside of component to avoid recreating it on renders
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm({ clientSecret, orderId }: { clientSecret: string; orderId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!stripe) {
      return
    }

    // Check for payment intent status on page load
    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          router.push(`/orders/${orderId}?success=true`)
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Please provide your payment details.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe, clientSecret, router, orderId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}?success=true`,
      },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay now"}
      </button>
      {message && <div className="text-red-500 text-center">{message}</div>}
    </form>
  )
}

export default function StripeCheckoutWrapper({
  amount,
  orderId,
}: {
  amount: number
  orderId: string
}) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/payment/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error)
      })
  }, [amount, orderId])

  const appearance = {
    theme: "stripe" as const,
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="max-w-md mx-auto">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
        </Elements>
      )}
    </div>
  )
}

