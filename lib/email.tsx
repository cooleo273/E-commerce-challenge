import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

// Interfaces
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

// Email template props interfaces
interface OrderConfirmationEmailProps {
  name: string;
  orderNumber: string;
  orderItems: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

interface OrderStatusEmailProps {
  name: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
}

interface WelcomeEmailProps {
  name: string;
}

// Email data interfaces
interface OrderConfirmationData extends OrderConfirmationEmailProps {
  email: string;
}

interface OrderStatusData extends OrderStatusEmailProps {
  email: string;
}

interface WelcomeEmailData extends WelcomeEmailProps {
  email: string;
}

// Email Components
const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  name,
  orderNumber,
  orderItems,
  total,
  shippingAddress,
}) => (
  <div>
    <h1>Thank you for your order, {name}!</h1>
    <p>Your order #{orderNumber} has been confirmed.</p>
    <h2>Order Summary</h2>
    <ul>
      {orderItems.map((item, index) => (
        <li key={index}>
          {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
        </li>
      ))}
    </ul>
    <p><strong>Total:</strong> ${total.toFixed(2)}</p>
    <h2>Shipping Address</h2>
    <p>
      {shippingAddress.street}<br />
      {shippingAddress.city}, {shippingAddress.state || ''} {shippingAddress.zipCode}<br />
      {shippingAddress.country}
    </p>
    <p>We'll notify you when your order ships.</p>
  </div>
);

const OrderStatusEmail: React.FC<OrderStatusEmailProps> = ({
  name,
  orderNumber,
  status,
  trackingNumber,
}) => (
  <div>
    <h1>Order Status Update</h1>
    <p>Hello {name},</p>
    <p>Your order #{orderNumber} is now <strong>{status}</strong>.</p>
    {trackingNumber && (
      <p>Your tracking number is: <strong>{trackingNumber}</strong></p>
    )}
    <p>Thank you for shopping with us!</p>
  </div>
);

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
  <div>
    <h1>Welcome to Our Store!</h1>
    <p>Hello {name},</p>
    <p>Thank you for creating an account with us. We're excited to have you as a customer!</p>
    <p>Start shopping now to discover our amazing products.</p>
  </div>
);

// Email sending functions
async function sendOrderConfirmation(
  data: OrderConfirmationData
): Promise<{ success: boolean; messageId?: string; error?: any }> {
  try {
    const result = await resend.emails.send({
      from: 'orders@yourdomain.com',
      to: data.email,
      subject: `Order Confirmation #${data.orderNumber}`,
      react: <OrderConfirmationEmail {...data} />,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

async function sendOrderStatusUpdate(
  data: OrderStatusData
): Promise<{ success: boolean; messageId?: string; error?: any }> {
  try {
    const result = await resend.emails.send({
      from: 'orders@yourdomain.com',
      to: data.email,
      subject: `Order #${data.orderNumber} Status Update`,
      react: <OrderStatusEmail {...data} />,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error('Error sending order status email:', error);
    return { success: false, error };
  }
}

async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<{ success: boolean; messageId?: string; error?: any }> {
  try {
    const result = await resend.emails.send({
      from: 'welcome@yourdomain.com',
      to: data.email,
      subject: 'Welcome to Our Store!',
      react: <WelcomeEmail name={data.name} />,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendWelcomeEmail,
  OrderConfirmationEmail,
  OrderStatusEmail,
  WelcomeEmail,
};
