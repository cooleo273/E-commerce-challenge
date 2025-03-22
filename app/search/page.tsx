import { Suspense } from "react"
import { fuzzySearch } from "@/lib/search"

import type { Metadata } from "next"
import ProductCard from "@/components/product-card"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || ""

  return {
    title: query ? `Search results for "${query}"` : "Search",
    description: `Search results for "${query}" in our store.`,
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{query ? `Search results for "${query}"` : "Search our store"}</h1>

      {!query && <p className="text-gray-500">Please enter a search term to find products.</p>}

      {query && (
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults query={query} />
        </Suspense>
      )}
    </div>
  )
}

async function SearchResults({ query }: { query: string }) {
  const results = await fuzzySearch(query)

  // Transform the results to match the ProductCard interface
  const products = results.map(product => ({
    ...product,
    images: ["/placeholder.jpg"],
    inventory: 10,
    category: product.category.name, // Extract the category name string
  }))

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">No results found</h2>
        <p className="text-gray-500">
          We couldn't find any products matching "{query}". Try using different keywords or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <p className="text-gray-500 mb-4">Found {products.length} results</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

