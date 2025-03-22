"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"


interface SearchSuggestion {
  products: Array<{
    id: string
    name: string
    images: string[]
    price: number
    category: { name: string }
  }>
  categories: Array<{
    id: string
    name: string
  }>
  brands: Array<{
    id: string
    name: string
    logo?: string
  }>
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions(null)
      return
    }

    async function fetchSuggestions() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle search submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsFocused(false)
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products, brands, and categories..."
          className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </form>

      {isFocused && suggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
          {suggestions.products.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Products</h3>
              <ul>
                {suggestions.products.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsFocused(false)}
                    >
                      {product.images[0] && (
                        <div className="w-10 h-10 relative mr-3">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          ${product.price.toFixed(2)} • {product.category.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.categories.length > 0 && (
            <div className="p-2 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Categories</h3>
              <ul className="flex flex-wrap gap-2">
                {suggestions.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.name}`}
                      className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                      onClick={() => setIsFocused(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.brands.length > 0 && (
            <div className="p-2 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Brands</h3>
              <ul className="flex flex-wrap gap-2">
                {suggestions.brands.map((brand) => (
                  <li key={brand.id}>
                    <Link
                      href={`/brands/${brand.name}`}
                      className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                      onClick={() => setIsFocused(false)}
                    >
                      {brand.logo && (
                        <div className="w-4 h-4 relative mr-1">
                          <Image
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-2 border-t">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block text-center text-blue-500 hover:text-blue-700 text-sm py-1"
              onClick={() => setIsFocused(false)}
            >
              View all results for "{query}"
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

