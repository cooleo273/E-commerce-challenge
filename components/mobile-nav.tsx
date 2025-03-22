"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, Heart, User, Home, Package, Search } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/lib/auth-context"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user, isAuthenticated, logout } = useAuth()

  if (!isMobile) return null

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span className="sr-only">Open menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6 relative flex-1 px-4 sm:px-6">
                  <nav className="space-y-1">
                    <Link
                      href="/"
                      className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        pathname === "/"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Home className="mr-4 h-6 w-6" />
                      Home
                    </Link>

                    <Link
                      href="/search"
                      className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        pathname === "/search"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="mr-4 h-6 w-6" />
                      Search
                    </Link>

                    <Link
                      href="/categories"
                      className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        pathname.startsWith("/categories")
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="mr-4 h-6 w-6" />
                      Categories
                    </Link>

                    <Link
                      href="/cart"
                      className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        pathname === "/cart"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingCart className="mr-4 h-6 w-6" />
                      Cart
                    </Link>

                    <Link
                      href="/favorites"
                      className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                        pathname === "/favorites"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="mr-4 h-6 w-6" />
                      Favorites
                    </Link>
                  </nav>

                  <div className="mt-10 pt-6 border-t border-gray-200">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center px-3 py-2">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {user && 'image' in user ? (
                                <img
                                  src={typeof user?.image === 'string' ? user.image : "/placeholder.svg"}
                                  alt={user.name || "User"}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <User className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">{user?.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          <Link
                            href="/account"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => setIsOpen(false)}
                          >
                            Your Account
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            onClick={() => setIsOpen(false)}
                          >
                            Your Orders
                          </Link>
                          {user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              onClick={() => setIsOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              logout()
                              setIsOpen(false)
                            }}
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          >
                            Sign out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <Link
                          href="/login"
                          className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          Create account
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

