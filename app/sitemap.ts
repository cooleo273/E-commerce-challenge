import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get base URL from environment or fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"

    // Get all data in parallel
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          updatedAt: true,
        },
      }),
      prisma.category.findMany({
        select: {
          name: true,
          updatedAt: true,
        },
      }),
      prisma.brand.findMany({
        select: {
          name: true,
          updatedAt: true,
        },
      }),
    ])

    // Static routes
    const routes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/brands`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ]

    // Product URLs with encoded IDs
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.id)}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))

    // Category URLs with encoded names
    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/categories/${encodeURIComponent(category.name)}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    // Brand URLs with encoded names
    const brandUrls = brands.map((brand) => ({
      url: `${baseUrl}/brands/${encodeURIComponent(brand.name)}`,
      lastModified: brand.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    return [...routes, ...productUrls, ...categoryUrls, ...brandUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    // Return minimal sitemap with just the homepage in case of error
    return [
      {
        url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ]
  }
}

