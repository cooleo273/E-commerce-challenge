import crypto from "crypto"

// Initialize Chapa with your secret key
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY!
const CHAPA_API_URL = "https://api.chapa.co/v1"
const WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET

// Generate a unique transaction reference
export function generateTxRef(prefix = "TX") {
  const timestamp = Date.now().toString()
  const randomStr = crypto.randomBytes(4).toString("hex")
  return `${prefix}-${timestamp}-${randomStr}`
}

// Verify webhook signature
export function verifyWebhookSignature(signature: string, payload: string) {
  if (!WEBHOOK_SECRET) return false

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET)
  const expectedSignature = hmac.update(payload).digest("hex")
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Initialize a payment with Chapa
export async function initializePayment({
  amount,
  currency = "ETB",
  email,
  firstName,
  lastName,
  phone,
  txRef,
  callbackUrl,
  customization = {},
  metadata = {},
}: {
  amount: number
  currency?: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  txRef: string
  callbackUrl: string
  customization?: {
    title?: string
    description?: string
    logo?: string
  }
  metadata?: any
}) {
  try {
    const response = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: callbackUrl,
        customization,
        meta: metadata,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = typeof data.message === 'object' 
        ? JSON.stringify(data.message) 
        : data.message || "Failed to initialize payment"
      throw new Error(errorMessage)
    }

    return {
      success: true,
      data: data.data,
      checkoutUrl: data.data.checkout_url,
    }
  } catch (error: any) {
    console.error("Error initializing Chapa payment:", error)
    return {
      success: false,
      error: error.message || "Failed to initialize payment",
    }
  }
}

// Verify a transaction
export async function verifyTransaction(txRef: string) {
  try {
    const response = await fetch(`${CHAPA_API_URL}/transaction/verify/${txRef}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify transaction")
    }

    return {
      success: true,
      data: data.data,
    }
  } catch (error: any) {
    console.error("Error verifying Chapa transaction:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

