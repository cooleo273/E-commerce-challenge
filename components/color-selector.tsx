"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Color {
  id: string
  name: string
  value: string
}

interface ColorSelectorProps {
  colors: Color[]
  defaultValue?: string
}

export function ColorSelector({ colors, defaultValue }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState(defaultValue || colors[0].id)

  return (
    <div className="flex space-x-2">
      {colors.map((color) => (
        <button
          key={color.id}
          className={cn(
            "h-10 w-10 rounded-full border-2 flex items-center justify-center",
            selectedColor === color.id ? "border-primary" : "border-muted",
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => setSelectedColor(color.id)}
          title={color.name}
        >
          {selectedColor === color.id && <span className="h-6 w-6 rounded-full border-2 border-background" />}
        </button>
      ))}
    </div>
  )
}

