"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface AddToCartProps {
  productId: string;
  color?: string;
  size?: string;
}

export default function AddToCart({ productId, color, size }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  async function handleAddToCart() {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const productResponse = await fetch(`/api/products/${productId}`);
      const productData = await productResponse.json();
      
      if (!productResponse.ok || !productData) {
        throw new Error("Failed to fetch product details");
      }

      // Create cart item object
      const cartItem = {
        productId,
        name: productData.name,
        price: Number(productData.price),
        image: productData.images?.[0] || "/placeholder.svg",
        quantity,
        color: color || "default",
        size: size || "default",
      };

      // Update context first for immediate UI update
      addItem(cartItem);

      // Then sync with backend
      const cartResponse = await fetch("/api/cart", {
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

      if (!cartResponse.ok) {
        const cartData = await cartResponse.json();
        throw new Error(cartData.error || "Failed to add to cart");
      }

      toast({
        title: "Added to cart",
        description: `${productData.name} has been added to your cart.`,
      });

    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
        variant: "destructive",
      });
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