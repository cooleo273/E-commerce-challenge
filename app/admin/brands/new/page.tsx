"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBrandPage() {
  const [name, setName] = useState("")
  const [logo, setLogo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      setError("Brand name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          logo: logo.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create brand")
      }

      router.push("/admin/brands")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/brands" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Brands
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Add New Brand</h1>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="mt-1 block w-full"
                placeholder="Enter logo URL"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a URL for the brand logo. You can upload an image using the product image uploader and copy the
                URL.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/brands")} className="mr-3">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Brand"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

