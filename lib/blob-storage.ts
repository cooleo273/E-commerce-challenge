import { put, del, list } from "@vercel/blob"
import { nanoid } from "nanoid"

// Upload an image to Vercel Blob Storage
export async function uploadProductImage(file: File) {
  try {
    // Generate a unique filename
    const filename = `${nanoid()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: "Failed to upload image",
    }
  }
}

// Delete an image from Vercel Blob Storage
export async function deleteProductImage(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      error: "Failed to delete image",
    }
  }
}

// List all product images
export async function listProductImages(prefix = "") {
  try {
    const { blobs } = await list({ prefix })
    return {
      success: true,
      images: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
    }
  } catch (error) {
    console.error("Error listing images:", error)
    return {
      success: false,
      error: "Failed to list images",
    }
  }
}

