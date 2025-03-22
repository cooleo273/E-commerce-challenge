"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import ImageUpload from "@/components/image-upload"

interface ProductFormProps {
  product?: any
  categories: any[]
  brands: any[]
  sizes: any[]
  colors: any[]
}

export default function ProductForm({ product, categories, brands, sizes, colors }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [thumbnails, setThumbnails] = useState<string[]>(product?.thumbnails || [])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      discount: product?.discount || "",
      inventory: product?.inventory || 0,
      isNew: product?.isNew || false,
      categoryId: product?.categoryId || "",
      brandId: product?.brandId || "",
      sizeIds: product?.sizes?.map((s: any) => s.id) || [],
      colorIds: product?.colors?.map((c: any) => c.id) || [],
    },
  })

  // Watch for changes to update the form
  const watchedSizeIds = watch("sizeIds")
  const watchedColorIds = watch("colorIds")

  // Set up form values
  useEffect(() => {
    if (product) {
      setValue("name", product.name)
      setValue("description", product.description || "")
      setValue("price", product.price)
      setValue("discount", product.discount || "")
      setValue("inventory", product.inventory || 0)
      setValue("isNew", product.isNew || false)
      setValue("categoryId", product.categoryId)
      setValue("brandId", product.brandId)
      setValue("sizeIds", product.sizes?.map((s: any) => s.id) || [])
      setValue("colorIds", product.colors?.map((c: any) => c.id) || [])
    }
  }, [product, setValue])

  async function onSubmit(data: any) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Add images to the data
      data.images = images
      data.thumbnails = thumbnails

      // Convert numeric fields
      data.price = Number.parseFloat(data.price)
      data.discount = data.discount ? Number.parseFloat(data.discount) : null
      data.inventory = Number.parseInt(data.inventory)

      // Make API request
      const url = product ? "/api/products" : "/api/products"
      const method = product ? "PUT" : "POST"

      // If editing, add the ID
      if (product) {
        data.id = product.id
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to save product")
      }

      // Redirect to products page
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8 border border-gray-100">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
        {/* Basic Info Section */}
        <div className="sm:col-span-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Product name is required" })}
            className="block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="price" className="block text-base font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="mt-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
              })}
              className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-base"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="discount" className="block text-base font-medium text-gray-700">
            Discount (%)
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="discount"
              min="0"
              max="100"
              {...register("discount", {
                min: { value: 0, message: "Discount must be positive" },
                max: { value: 100, message: "Discount cannot exceed 100%" },
              })}
              className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-base"
            />
            {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount.message as string}</p>}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
            Inventory
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="inventory"
              min="0"
              {...register("inventory", {
                required: "Inventory is required",
                min: { value: 0, message: "Inventory must be positive" },
              })}
              className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-base"
            />
            {errors.inventory && <p className="mt-1 text-sm text-red-600">{errors.inventory.message as string}</p>}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-800 mb-1">
            Category
          </label>
          <div className="relative">
            <select
              id="categoryId"
              {...register("categoryId", { required: "Category is required" })}
              className="block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm appearance-none bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message as string}</p>}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-800 mb-1">
            Brand
          </label>
          <div className="relative">
            <select
              id="brandId"
              {...register("brandId", { required: "Brand is required" })}
              className="block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm appearance-none bg-white"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {errors.brandId && <p className="mt-1 text-sm text-red-600">{errors.brandId.message as string}</p>}
          </div>
        </div>

        <div className="sm:col-span-6">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">Sizes</span>
              <span className="text-xs text-gray-500 font-normal">(Select all that apply)</span>
            </legend>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <div 
                    key={size.id} 
                    className={`relative flex items-center px-3 py-1.5 border rounded-md transition-all duration-200 cursor-pointer ${
                      watchedSizeIds?.includes(size.id) 
                        ? 'border-black bg-black text-white shadow-sm' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const currentValues = watchedSizeIds || []
                      const isSelected = currentValues.includes(size.id)
                      setValue(
                        "sizeIds",
                        isSelected 
                          ? currentValues.filter((v: string) => v !== size.id)
                          : [...currentValues, size.id]
                      )
                    }}
                  >
                    <input
                      id={`size-${size.id}`}
                      type="checkbox"
                      value={size.id}
                      {...register("sizeIds")}
                      checked={watchedSizeIds?.includes(size.id)}
                      onChange={(e) => {
                        const checked = e.target.checked
                        const value = e.target.value
                        const currentValues = watchedSizeIds || []

                        setValue(
                          "sizeIds",
                          checked ? [...currentValues, value] : currentValues.filter((v: string) => v !== value),
                        )
                      }}
                      className={`h-3.5 w-3.5 rounded ${
                        watchedSizeIds?.includes(size.id) 
                          ? 'border-white text-white' 
                          : 'border-gray-300 text-black'
                      } focus:ring-black`}
                    />
                    <label htmlFor={`size-${size.id}`} className="ml-1.5 text-sm font-medium cursor-pointer">
                      {size.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>

        <div className="sm:col-span-6">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">Colors</span>
              <span className="text-xs text-gray-500 font-normal">(Select all that apply)</span>
            </legend>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <div 
                    key={color.id} 
                    className={`relative flex items-center px-3 py-1.5 border rounded-md transition-all duration-200 cursor-pointer ${
                      watchedColorIds?.includes(color.id) 
                        ? 'border-black bg-gray-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const currentValues = watchedColorIds || []
                      const isSelected = currentValues.includes(color.id)
                      setValue(
                        "colorIds",
                        isSelected 
                          ? currentValues.filter((v: string) => v !== color.id)
                          : [...currentValues, color.id]
                      )
                    }}
                  >
                    <input
                      id={`color-${color.id}`}
                      type="checkbox"
                      value={color.id}
                      {...register("colorIds")}
                      checked={watchedColorIds?.includes(color.id)}
                      onChange={(e) => {
                        const checked = e.target.checked
                        const value = e.target.value
                        const currentValues = watchedColorIds || []

                        setValue(
                          "colorIds",
                          checked ? [...currentValues, value] : currentValues.filter((v: string) => v !== value),
                        )
                      }}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <div className="ml-1.5 flex items-center">
                      <div 
                        className={`h-4 w-4 rounded-full mr-1.5 ${
                          watchedColorIds?.includes(color.id) ? 'ring-2 ring-black ring-offset-1' : 'border border-gray-300'
                        }`} 
                        style={{ backgroundColor: color.value }} 
                      />
                      <label htmlFor={`color-${color.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                        {color.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
        </div>

        <div className="sm:col-span-6">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="isNew"
                type="checkbox"
                {...register("isNew")}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isNew" className="font-medium text-gray-700">
                Mark as New Product
              </label>
              <p className="text-gray-500">This will display a "New" badge on the product.</p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Product Images</label>
          <div className="mt-1">
            <ImageUpload images={images} onChange={setImages} maxImages={5} />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Thumbnail Images</label>
          <div className="mt-1">
            <ImageUpload images={thumbnails} onChange={setThumbnails} maxImages={3} />
          </div>
        </div>
        
      </div>

      <div className="pt-5 border-t">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-lg border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-4 inline-flex justify-center rounded-lg border border-transparent bg-black py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-75 transition-colors"
          >
            {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  )
}

