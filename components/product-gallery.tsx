"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGalleryProps {
  images: string[]
  thumbnails: string[]
}

export function ProductGallery({ images, thumbnails }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-md border">
        <Image
          src={images[activeImage] || "/placeholder.svg"}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
              activeImage === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image
              src={thumbnail || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// Add a skeleton loader for ProductGallery
export function ProductGallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-md" />
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Array(4).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-20 w-20 flex-shrink-0 rounded-md" />
        ))}
      </div>
    </div>
  )
}

