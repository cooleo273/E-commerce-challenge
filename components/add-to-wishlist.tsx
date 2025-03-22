"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AddToWishlistProps {
  productId: string;
}

export default function AddToWishlist({ productId }: AddToWishlistProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  async function checkWishlistStatus() {
    try {
      const response = await fetch(`/api/wishlist/check?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  }

  async function handleToggleWishlist() {
    try {
      setLoading(true);
      const response = await fetch("/api/wishlist", {
        method: isInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      setIsInWishlist(!isInWishlist);
      router.refresh();
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className="w-full border border-gray-300 py-2 px-6 rounded hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Updating..." : isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
}