interface OrderConfirmationParams {
  email: string
  name: string
  orderNumber: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export async function sendOrderConfirmation(params: OrderConfirmationParams) {
  // Implement your email sending logic here
  console.log('Sending order confirmation email:', params)
}