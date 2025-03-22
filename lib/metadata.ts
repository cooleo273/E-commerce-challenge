import type { Metadata } from "next"

// Base metadata
export const baseMetadata: Metadata = {
  title: {
    default: "Your E-commerce Store",
    template: "%s | Your E-commerce Store",
  },
  description: "Shop the latest products at our online store.",
  keywords: ["e-commerce", "online shopping", "products", "store"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Company",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Your E-commerce Store",
    title: "Your E-commerce Store",
    description: "Shop the latest products at our online store.",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your E-commerce Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your E-commerce Store",
    description: "Shop the latest products at our online store.",
    images: ["https://yourdomain.com/twitter-image.jpg"],
    creator: "@yourhandle",
  },
}

// Product metadata
export function generateProductMetadata(product: any): Metadata {
  if (!product) {
    return {}
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at our store.`,
    keywords: [product.name, product.category?.name, product.brand?.name, "shopping", "online store"].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at our store.`,
      url: `https://yourdomain.com/products/${product.id}`,
      images: product.images.map((image: string) => ({
        url: image,
        alt: product.name,
      })),
    },
    twitter: {
      title: product.name,
      description: product.description || `Buy ${product.name} at our store.`,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  }
}

// Category metadata
export function generateCategoryMetadata(category: any): Metadata {
  if (!category) {
    return {}
  }

  return {
    title: `${category.name} Products`,
    description: `Shop our collection of ${category.name} products.`,
    keywords: [category.name, "category", "products", "shopping"],
    openGraph: {
      title: `${category.name} Products`,
      description: `Shop our collection of ${category.name} products.`,
      url: `https://yourdomain.com/categories/${category.name}`,
    },
  }
}

// Brand metadata
export function generateBrandMetadata(brand: any): Metadata {
  if (!brand) {
    return {}
  }

  return {
    title: `${brand.name} Products`,
    description: `Shop our collection of ${brand.name} products.`,
    keywords: [brand.name, "brand", "products", "shopping"],
    openGraph: {
      title: `${brand.name} Products`,
      description: `Shop our collection of ${brand.name} products.`,
      url: `https://yourdomain.com/brands/${brand.name}`,
      images: brand.logo ? [{ url: brand.logo, alt: brand.name }] : undefined,
    },
  }
}

