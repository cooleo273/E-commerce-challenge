import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridProps {
  products: any[]
  limit?: number
}

export function ProductGrid({ products, limit = 24 }: ProductGridProps) {
  const displayProducts = products.slice(0, limit)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {displayProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="h-full overflow-hidden border-0 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="aspect-square relative overflow-hidden rounded-md">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    New
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 pt-0">
              <div className="flex items-center gap-0.5 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
              </div>
              <h3 className="font-medium text-base">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {product.discount ? (
                  <>
                    <p className="font-bold">${(product.price * (1 - product.discount / 100)).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// ProductGridSkeleton component remains unchanged
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="h-full overflow-hidden border-0 shadow-sm">
          <CardContent className="p-4">
            <Skeleton className="aspect-square w-full rounded-md" />
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4 pt-0">
            <div className="flex items-center gap-0.5 mb-2 w-24">
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

