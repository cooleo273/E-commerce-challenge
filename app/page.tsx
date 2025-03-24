import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ProductList, ProductListSkeleton } from "@/components/product-list"
import { WishlistIcon } from "@/components/wishlist-icon"
import { RecommendedProducts } from "@/components/recommended-products"
import { Suspense } from "react"
import { UserNav } from "@/components/user-nav"
import { PageMainNav } from "@/components/page-main-nav"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Replace the existing header section with this updated version */}
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-2xl">
            BR<span className="text-primary">.</span>
          </Link>
          <MainNav className="mx-6" />
          <PageMainNav/>
          <div className="ml-auto flex items-center space-x-4">
            <WishlistIcon />
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[600px] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&h=600&fit=crop"
              alt="Premium Footwear Collection"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white space-y-6">
                  <h1 className="text-5xl font-bold leading-tight">Step Into Style & Comfort</h1>
                  <p className="text-xl opacity-90">
                    Discover our premium collection of footwear designed for those who demand both style and comfort.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" asChild>
                      <Link href="/women">Shop Women</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/men">Shop Men</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Women's Collection",
                  image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
                  link: "/women",
                },
                {
                  title: "Men's Collection",
                  image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop",
                  link: "/men",
                },
                {
                  title: "Sports Collection",
                  image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400&h=500&fit=crop",
                  link: "/sports",
                },
              ].map((category, index) => (
                <Link key={index} href={category.link} className="group block">
                  <div className="relative h-[400px] overflow-hidden rounded-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                        <span className="flex items-center text-sm group-hover:underline">
                          Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            <div className="w-full">
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList />
              </Suspense>
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recommended Products Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <RecommendedProducts />
          </div>
        </section>

        {/* Brand Showcase */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Brands</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {["Nike", "Adidas", "Puma", "New Balance", "Reebok", "Converse"].map((brand) => (
                <div key={brand} className="text-center opacity-60 hover:opacity-100 transition-opacity">
                  <h3 className="text-2xl font-bold">{brand}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah J.",
                  quote: "The most comfortable shoes I've ever worn. I'm definitely coming back for more!",
                  rating: 5,
                },
                {
                  name: "Michael T.",
                  quote:
                    "Great quality and fast shipping. The customer service was excellent when I needed to exchange sizes.",
                  rating: 5,
                },
                {
                  name: "Emily R.",
                  quote: "Stylish, comfortable, and durable. These shoes have exceeded my expectations in every way.",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-lg">
                  <div className="flex mb-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating
                            ? "fill-primary-foreground text-primary-foreground"
                            : "text-primary-foreground/30"
                            }`}
                        />
                      ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-bold">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" placeholder="Your email address" className="flex-1 px-4 py-2 border rounded-md" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 BR. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
