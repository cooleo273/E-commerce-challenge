"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface CategoryListProps {
  categories: any[]
}

export default function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Start editing a category
  function handleEdit(category: any) {
    setEditingId(category.id)
    setEditName(category.name)
    setError(null)
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingId(null)
    setEditName("")
    setError(null)
  }

  // Save edited category
  async function handleSaveEdit() {
    if (!editName.trim()) {
      setError("Category name cannot be empty")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: editName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update category")
      }

      const updatedCategory = await response.json()

      // Update the local state
      setCategories(categories.map((cat) => (cat.id === editingId ? { ...cat, name: updatedCategory.name } : cat)))

      setEditingId(null)
      setEditName("")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a category
  async function handleDelete(id: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      // Update the local state
      setCategories(categories.filter((cat) => cat.id !== id))
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
              Name
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
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === category.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full"
                    placeholder="Category name"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{category._count?.products || 0} products</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId === category.id ? (
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
                      onClick={() => handleEdit(category)}
                      variant="ghost"
                      size="icon"
                      className="text-black hover:text-gray-900 hover:bg-blue-50"
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
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-medium">{category.name}</span>? This
                            will also remove this category from all associated products.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
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

