import Script from "next/script"

interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description?: string
    price: number
    images: string[]
    rating?: number
    reviewCount?: number
    brand?: {
      name: string
    }
    category?: {
      name: string
    }
  }
  url: string
}

export default function ProductSchema({ product, url }: ProductSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Brand Name",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  }

  // Add reviews if available
  if (product.rating && product.reviewCount) {
    Object.assign(schemaData, {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    })
  }

  return (
    <Script id={`product-schema-${product.id}`} type="application/ld+json">
      {JSON.stringify(schemaData)}
    </Script>
  )
}

