import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/main-nav";
import { ProductReviews } from "@/components/product-reviews";
import { ProductGallery } from "@/components/product-gallery";
import { SizeSelector } from "@/components/size-selector";
import { ColorSelector } from "@/components/color-selector";
import { RelatedProducts } from "@/components/related-products";
import { PopularBrands } from "@/components/popular-brands";
import { Metadata } from 'next';
import AddToCart from "@/components/add-to-cart";
import AddToWishlist from "@/components/add-to-wishlist";
import prisma from "@/lib/prisma";
import { PageMainNav } from "@/components/page-main-nav";

// Fetch real product data from the database
async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
    });
    
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Fix the interface to match Next.js 13+ expectations
interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }
 
   // Calculate discounted price
  const discountedPrice = product.discount && product.discount > 0
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center px-4 max-w-full">
          <Link href="/" className="font-bold text-2xl">
            BR<span className="text-primary">.</span>
          </Link>
          <MainNav className="mx-6" />
          <PageMainNav/>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          {/* Breadcrumb navigation */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Product Gallery with subtle animation */}
              <div className="transition-all duration-300 hover:scale-[1.02]">
                <ProductGallery
                  images={product.images || []}
                  thumbnails={product.thumbnails || []}
                />
              </div>

              <div className="space-y-5 py-2">
                {/* Product header section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                      {product.category?.name || "Not categorized"}
                    </span>
                    {product.isNew && (
                      <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 rounded-full text-blue-600">
                        New
                      </span>
                    )}
                    {product.inventory < 10 && (
                      <span className="text-xs font-medium px-2.5 py-1 bg-amber-100 rounded-full text-amber-600">
                        Limited Stock
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                  
                  {/* Rating stars with hover effect */}
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-colors duration-200 hover:text-yellow-500 ${
                              i < 4 
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.reviewCount || 0} reviews
                    </span>
                  </div>
                  
                  {/* Price with animated discount badge */}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <>
                        <span className="text-base text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-md animate-pulse">
                          {product.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Product description - shortened */}
                <p className="text-gray-600 leading-relaxed">
                  {product.description && product.description.length > 150 
                    ? `${product.description.substring(0, 150)}...` 
                    : (product.description || "No description available")}
                </p>
                
                {/* Color and Size selectors with improved styling */}
                <div className="space-y-4 pt-2">
                  {product.colors.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Color</h3>
                      <ColorSelector 
                        colors={product.colors.map(color => ({
                          id: color.id,
                          label: color.name,
                          name: color.name,
                          value: color.value
                        }))} 
                        defaultValue={product.colors[0].id} 
                      />
                    </div>
                  )}

                  {product.sizes.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Size</h3>
                      <SizeSelector
                        sizes={product.sizes.map((size) => ({ id: size.id, label: size.name }))}
                        defaultValue={product.sizes[0].id}
                      />
                    </div>
                  )}
                </div>

                {/* Action buttons with hover effects */}
                <div className="pt-5 space-y-3">
                  <AddToCart productId={product.id} />
                  <AddToWishlist productId={product.id} />
                </div>

                {/* Product details in a styled card */}
                <div className="border border-gray-100 rounded-lg bg-gray-50 p-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p>{product.inventory > 0 ? `In stock: ${product.inventory} units` : "Out of stock"}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Brand:</span> {product.brand?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <span className="text-green-500">✓</span> Free shipping on orders over $100
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section with improved styling */}
          <div className="mt-10 bg-white rounded-xl shadow-sm">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b rounded-t-xl h-auto p-0 bg-gray-50">
                <TabsTrigger
                  value="details"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white py-3 px-5"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white py-3 px-5"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-white py-3 px-5"
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6">
                <div className="max-w-3xl space-y-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6">
                <ProductReviews rating={4} reviewCount={product.reviewCount || 0} />
              </TabsContent>
              <TabsContent value="shipping" className="p-6">
                <div className="max-w-3xl space-y-4">
                  <h3 className="font-medium text-lg">Shipping Information</h3>
                  <p className="text-gray-700">We offer standard shipping that typically takes 3-5 business days. Express shipping is available for an additional fee.</p>
                  
                  <h3 className="font-medium text-lg mt-6">Return Policy</h3>
                  <p className="text-gray-700">Returns are accepted within 30 days of purchase. Items must be in original condition with tags attached.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related products section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <RelatedProducts category={product.category?.name || ""} currentProductId={product.id} />
          </div>

          {/* Brands section - made more compact */}
          <div className="mt-12 mb-8">
            <PopularBrands />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-12 mt-12">
        <div className="container mx-auto px-4 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-base text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-gray-600 hover:text-gray-900">
                    News
                  </Link>
                </li>
              </ul>
            </div>
            {/* Rest of the footer remains the same */}
          </div>
          <div className="border-t mt-10 pt-10">
            <p className="text-base text-gray-600 text-center">© 2025 BR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Await the params object here too
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found'
    }
  }

  return {
    title: `${product.name} | BR Store`,
    description: product.description || '',
  }
}

