"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddToCartProps {
  productId: string;
  color?: string;
  size?: string;
}

export default function AddToCart({ productId, color, size }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAddToCart() {
    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          color,
          size,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex items-center border rounded">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={loading}
        >
          -
        </button>
        <span className="px-4 py-2 border-x">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={loading}
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}