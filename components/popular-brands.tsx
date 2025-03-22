import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PopularBrands() {
  const brands = [
    { id: 1, name: "Nike", logo: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Adidas", logo: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Puma", logo: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "New Balance", logo: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Popular brands with discounts over 25%</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {brands.map((brand) => (
          <div key={brand.id} className="w-8 h-8 rounded-full overflow-hidden">
            <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} width={32} height={32} />
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full sm:w-auto">
        View more
      </Button>
    </div>
  )
}

