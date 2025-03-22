"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login, isAuthenticated, user } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Auth State on Login Page:', { isAuthenticated, user })
    
    // Only redirect if we're sure the user is authenticated
    if (isAuthenticated && user && user.role === "ADMIN") {
      console.log('Already authenticated, redirecting to dashboard')
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('Login attempt with email:', email)

    try {
      const result = await login(email, password)
      console.log('Login result:', result)

      if (result.success) {
        console.log('Login successful, preparing to redirect...')
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        })
        
        // Remove the setTimeout to avoid race conditions
        console.log('Redirecting to dashboard...')
        router.push("/admin/dashboard")
      } else {
        console.log('Login failed:', result.error)
        toast({
          title: "Login failed",
          description: result.error || "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error details:", error)
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render the login form if already authenticated
  if (isAuthenticated && user && user.role === "ADMIN") {
    return <div className="flex min-h-screen items-center justify-center">Redirecting to dashboard...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="font-bold text-3xl">
              BR<span className="text-primary">.</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>  
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"  
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            For demo purposes, use username: <strong>admin</strong> and password: <strong>password</strong>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

