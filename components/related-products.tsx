import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getAllProducts } from "@/lib/products"

interface RelatedProductsProps {
  category?: string
  currentProductId?: string
}

export async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const products = await getAllProducts()
  
  // Filter related products by category and exclude current product
  const relatedProducts = products
    .filter((product) => 
      product.category.name === category && 
      product.id !== currentProductId
    )
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    // If no products in the same category, show random products
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products
            .filter(product => product.id !== currentProductId)
            .slice(0, 4)
            .map((product) => renderProductCard(product))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => renderProductCard(product))}
      </div>
    </div>
  )
}

function renderProductCard(product: any) {
  return (
    <Link key={product.id} href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden border-0 shadow-sm transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="aspect-square relative overflow-hidden rounded-md">
            <Image
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 pt-0">
          <div className="flex items-center gap-0.5 mb-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
          </div>
          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {product.discount ? (
              <>
                <p className="font-bold text-sm">${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </>
            ) : (
              <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

