"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Create a client component that uses hooks
export function RecommendedProducts() {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products on the client side
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/recommended');
        const data = await response.json();
        setRecommendedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full overflow-hidden border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100 animate-pulse" />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 pt-0">
                <div className="w-2/3 h-4 bg-gray-100 animate-pulse mb-2" />
                <div className="w-1/3 h-4 bg-gray-100 animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendedProducts.map((product) => (
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
        ))}
      </div>
    </div>
  );
}

