"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { formatPrice } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inventory: number
  discount?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        size: "",
        color: "",
      })
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        })
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error)
    }
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
        onClick={handleWishlistToggle}
      >
        <Heart
          className={`h-5 w-5 ${
            inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </Button>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
          >
            {product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}