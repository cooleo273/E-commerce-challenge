import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Create a payment intent for an order
export async function createPaymentIntent(amount: number, metadata: any = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Retrieve a payment intent
export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      success: true,
      paymentIntent,
    }
  } catch (error: any) {
    console.error("Error retrieving payment intent:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Handle webhook events from Stripe
export async function handleWebhookEvent(rawBody: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    return {
      success: true,
      event,
    }
  } catch (error: any) {
    console.error("Error verifying webhook signature:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

