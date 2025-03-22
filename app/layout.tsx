import type React from "react"
import { baseMetadata } from "@/lib/metadata"
import { AuthProvider } from "@/lib/auth-context"
import OrganizationSchema from "@/components/organization-schema"
import { WishlistProvider } from "@/lib/wishlist-context"
import { CartProvider } from "@/lib/cart-context"

export const metadata = baseMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrganizationSchema/>
            {children}
          </WishlistProvider>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'