import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getAllProducts } from "@/lib/products"
import { Skeleton } from "@/components/ui/skeleton"

export async function ProductList() {
  // Get first 4 products from database
  const products = await getAllProducts();
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="h-full overflow-hidden border-0 shadow-sm transition-all hover:shadow-md group">
            <CardContent className="p-4">
              <div className="aspect-square relative overflow-hidden rounded-md">
                <Image
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-300"
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
                <span className="text-xs text-muted-foreground ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
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
              <div className="w-full mt-3">
                <span className="text-xs text-muted-foreground">
                  {product.category.name} • {product.brand.name}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// Add a skeleton loader for ProductList
export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className="h-full overflow-hidden border-0 shadow-sm">
          <CardContent className="p-4">
            <Skeleton className="aspect-square w-full rounded-md" />
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4 pt-0">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

