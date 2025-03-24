'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for filters
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    
    // Add price range
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())
    
    // Add brands
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','))
    } else {
      params.delete('brands')
    }
    
    // Add size
    if (selectedSize) {
      params.set('size', selectedSize)
    } else {
      params.delete('size')
    }
    
    // Add color
    if (selectedColor) {
      params.set('color', selectedColor)
    } else {
      params.delete('color')
    }

    router.push(`?${params.toString()}`)
  }

  // Handle brand selection
  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev => 
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    )
  }

  // Effect to apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [priceRange, selectedBrands, selectedSize, selectedColor])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider 
          defaultValue={priceRange} 
          min={0} 
          max={300} 
          step={10} 
          onValueChange={setPriceRange}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">$0</span>
          <span className="text-sm">$300</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="space-y-3">
          {["Nike", "Adidas", "Puma", "Reebok", "New Balance"].map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={`brand-${brand.toLowerCase()}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <label htmlFor={`brand-${brand.toLowerCase()}`} className="text-sm font-medium">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"].map((size) => (
            <div
              key={size}
              className={`flex items-center justify-center h-10 border rounded-md text-sm cursor-pointer
                ${selectedSize === size ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Color</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Black", value: "#000000" },
            { name: "White", value: "#FFFFFF" },
            { name: "Red", value: "#EF4444" },
            { name: "Blue", value: "#3B82F6" },
            { name: "Green", value: "#10B981" },
            { name: "Yellow", value: "#F59E0B" },
            { name: "Purple", value: "#8B5CF6" },
            { name: "Pink", value: "#EC4899" },
            { name: "Gray", value: "#6B7280" },
          ].map((color) => (
            <div
              key={color.name}
              className={`w-8 h-8 rounded-full border cursor-pointer
                ${selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              onClick={() => setSelectedColor(color.name === selectedColor ? '' : color.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

