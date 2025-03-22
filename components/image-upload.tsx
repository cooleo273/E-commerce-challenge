"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Upload } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images = [], onChange, maxImages = 5 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`)
      return
    }

    setIsUploading(true)
    setError(null)

    const newImages = [...images]

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Create form data
        const formData = new FormData()
        formData.append("file", file)

        // Upload the image
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to upload image")
        }

        const data = await response.json()
        newImages.push(data.url)
      }

      onChange(newImages)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleRemove(index: number) {
    const imageToRemove = images[index]
    const newImages = images.filter((_, i) => i !== index)

    try {
      // Delete the image from storage
      await fetch(`/api/upload?url=${encodeURIComponent(imageToRemove)}`, {
        method: "DELETE",
      })

      onChange(newImages)
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <Image src={image || "/placeholder.svg"} alt={`Product image ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="border border-dashed rounded-md flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {isUploading && <p className="text-blue-500">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-sm text-gray-500">
        {images.length} of {maxImages} images uploaded. PNG, JPG, WEBP or GIF. Max 5MB each.
      </p>
    </div>
  )
}

