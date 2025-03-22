import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

export function CategoryFilter() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider defaultValue={[0, 200]} min={0} max={300} step={10} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm">$0</span>
          <span className="text-sm">$300</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Brands</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="brand-nike" />
            <label
              htmlFor="brand-nike"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nike
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="brand-adidas" />
            <label
              htmlFor="brand-adidas"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Adidas
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="brand-puma" />
            <label
              htmlFor="brand-puma"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Puma
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="brand-reebok" />
            <label
              htmlFor="brand-reebok"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Reebok
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="brand-nb" />
            <label
              htmlFor="brand-nb"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Balance
            </label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"].map((size) => (
            <div
              key={size}
              className="flex items-center justify-center h-10 border rounded-md text-sm hover:bg-muted cursor-pointer"
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
              className="w-8 h-8 rounded-full border cursor-pointer"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

