import { LRUCache } from "lru-cache"

// Create cache instances
const productCache = new LRUCache<string, any>({
  max: 100, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
})

const categoryCache = new LRUCache<string, any>({
  max: 20,
  ttl: 1000 * 60 * 30, // 30 minutes
})

const brandCache = new LRUCache<string, any>({
  max: 20,
  ttl: 1000 * 60 * 30, // 30 minutes
})

// Cache middleware for products
export async function getCachedProduct(id: string, fetcher: () => Promise<any>) {
  const cacheKey = `product:${id}`

  // Check if in cache
  const cached = productCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch data
  const data = await fetcher()

  // Store in cache
  if (data) {
    productCache.set(cacheKey, data)
  }

  return data
}

// Cache middleware for product listings
export async function getCachedProducts(cacheKey: string, fetcher: () => Promise<any>) {
  // Check if in cache
  const cached = productCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch data
  const data = await fetcher()

  // Store in cache
  if (data) {
    productCache.set(cacheKey, data)
  }

  return data
}

// Cache middleware for categories
export async function getCachedCategories(fetcher: () => Promise<any>) {
  const cacheKey = "categories"

  // Check if in cache
  const cached = categoryCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch data
  const data = await fetcher()

  // Store in cache
  if (data) {
    categoryCache.set(cacheKey, data)
  }

  return data
}

// Cache middleware for brands
export async function getCachedBrands(fetcher: () => Promise<any>) {
  const cacheKey = "brands"

  // Check if in cache
  const cached = brandCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch data
  const data = await fetcher()

  // Store in cache
  if (data) {
    brandCache.set(cacheKey, data)
  }

  return data
}

// Invalidate cache for a product
export function invalidateProductCache(id: string) {
  const cacheKey = `product:${id}`
  productCache.delete(cacheKey)
}

// Invalidate all product caches
export function invalidateAllProductCaches() {
  productCache.clear()
}

// Invalidate category cache
export function invalidateCategoryCache() {
  categoryCache.clear()
}

// Invalidate brand cache
export function invalidateBrandCache() {
  brandCache.clear()
}

