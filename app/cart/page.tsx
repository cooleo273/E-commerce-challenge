import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { PageMainNav } from "@/components/page-main-nav"
import { CartItems } from "@/components/cart-items"

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
          <Link href="/" className="font-bold text-2xl">
            BR<span className="text-black">.</span>
          </Link>
          <MainNav className="mx-6" />
          <PageMainNav/>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Shopping Cart</h1>
          <CartItems />
        </div>
      </main>

      <footer className="bg-white border-t py-8 mt-12">
        <div className="container px-4 max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 text-center">© 2025 BR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
