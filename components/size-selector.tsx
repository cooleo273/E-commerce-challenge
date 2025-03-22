"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Size {
  id: string
  label: string
}

interface SizeSelectorProps {
  sizes: Size[]
  defaultValue?: string
}

export function SizeSelector({ sizes, defaultValue }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState(defaultValue || sizes[0].id)

  return (
    <div className="grid grid-cols-6 gap-2">
      {sizes.map((size) => (
        <Button
          key={size.id}
          variant={selectedSize === size.id ? "default" : "outline"}
          className="h-10"
          onClick={() => setSelectedSize(size.id)}
        >
          {size.label}
        </Button>
      ))}
    </div>
  )
}

