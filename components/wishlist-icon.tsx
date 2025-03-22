"use client"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"

export function WishlistIcon() {
  const { itemCount } = useWishlist()

  return (
    <Link href="/favorites">
      <Button variant="ghost" size="icon" className="relative">
        <Heart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
        <span className="sr-only">Wishlist</span>
      </Button>
    </Link>
  )
}