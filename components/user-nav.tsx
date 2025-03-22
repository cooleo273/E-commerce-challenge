"use client"

import Link from "next/link"
import { useState } from "react"
import { User, LogOut, Settings, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  // This is a placeholder for authentication state
  // In a real app, you would use your auth context here
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Placeholder user data
  const user = isAuthenticated ? {
    name: "User Name",
    email: "user@example.com"
  } : null

  // Placeholder logout function
  const handleLogout = () => {
    setIsAuthenticated(false)
    // In a real app, you would call your logout API here
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )
  }

  // At this point, we know isAuthenticated is true, so user cannot be null
  const userData = user!; // Non-null assertion

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}