"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"


type User = {
  id: string
  name: string | null
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Add session caching
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    if (sessionChecked) return

    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data && data.role === 'ADMIN') {
          setIsAuthenticated(true)
          setUser(data)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setSessionChecked(true)
        setIsLoading(false)
      }
    }
  
    checkSession()
  }, [sessionChecked])

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data && data.role === 'ADMIN') {
          setIsAuthenticated(true)
          setUser(data)
        } else {
          setIsAuthenticated(false)
          setUser(null)
          // router.push('/admin/login')
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Session check failed:', error)
        setIsAuthenticated(false)
        setUser(null)
        // router.push('/admin/login')
        setIsLoading(false)
      }
    }
  
    checkSession()
  }, [router])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      setUser(data)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" }
      }

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

