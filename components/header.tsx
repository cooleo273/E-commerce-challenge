import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { CartIcon } from "@/components/cart-icon"
import { PageMainNav } from "./page-main-nav"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
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
          <CartIcon />
        </div>
      </div>
    </header>
  )
}

