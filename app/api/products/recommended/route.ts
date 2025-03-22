import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getAllProducts();
    
    // In a real app, you would implement recommendation logic here
    // For now, just return random products
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    
    return NextResponse.json(shuffled.slice(0, 8));
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return NextResponse.json({ error: "Failed to fetch recommended products" }, { status: 500 });
  }
}