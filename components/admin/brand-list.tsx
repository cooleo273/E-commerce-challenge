"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BrandListProps {
  brands: any[]
}

export default function BrandList({ brands: initialBrands }: BrandListProps) {
  const [brands, setBrands] = useState(initialBrands)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editLogo, setEditLogo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Start editing a brand
  function handleEdit(brand: any) {
    setEditingId(brand.id)
    setEditName(brand.name)
    setEditLogo(brand.logo || "")
    setError(null)
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingId(null)
    setEditName("")
    setEditLogo("")
    setError(null)
  }

  // Save edited brand
  async function handleSaveEdit() {
    if (!editName.trim()) {
      setError("Brand name cannot be empty")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: editName,
          logo: editLogo,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update brand")
      }

      const updatedBrand = await response.json()

      // Update the local state
      setBrands(
        brands.map((brand) =>
          brand.id === editingId ? { ...brand, name: updatedBrand.name, logo: updatedBrand.logo } : brand,
        ),
      )

      setEditingId(null)
      setEditName("")
      setEditLogo("")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a brand
  async function handleDelete(id: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/brands?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete brand")
      }

      // Update the local state
      setBrands(brands.filter((brand) => brand.id !== id))
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Brand
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Products
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === brand.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full"
                      placeholder="Brand name"
                    />
                    <Input
                      value={editLogo}
                      onChange={(e) => setEditLogo(e.target.value)}
                      className="w-full"
                      placeholder="Logo URL (optional)"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    {brand.logo && (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <Image
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-contain bg-gray-100"
                        />
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{brand._count?.products || 0} products</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId === brand.id ? (
                  <div className="flex justify-end space-x-2">
                    <Button onClick={handleSaveEdit} disabled={isSubmitting} size="sm">
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(brand)}
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                    >
                      <Edit className="h-5 w-5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900 hover:bg-red-50">
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{brand.name}</span>? This will
                            also remove this brand from all associated products.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(brand.id)}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

