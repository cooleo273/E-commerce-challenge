import React, { useState } from "react";
import Image from "next/image";
import AddToWishlist from "./add-to-wishlist";
import AddToCart from "./add-to-cart";


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  images: string[];
  colors?: { name: string; value: string }[];
  sizes?: { name: string; value: string }[];
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative rounded-lg overflow-hidden ${
                selectedImage === index ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Image src={image} alt={product.name} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="mt-4">
          {product.discount ? (
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">${discountedPrice.toFixed(2)}</p>
              <p className="text-lg text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-green-600 font-semibold">
                {product.discount}% OFF
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <AddToCart
              productId={product.id}
              color={selectedColor}
              size={selectedSize}
            />
            <AddToWishlist productId={product.id} />
          </div>

          <div className="prose mt-6">
            <h3 className="font-semibold">Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Category:</span> {product.category.name}
            </p>
            <p>
              <span className="font-semibold">Brand:</span> {product.brand.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}