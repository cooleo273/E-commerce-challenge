"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "@/components/login-form"

export function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}