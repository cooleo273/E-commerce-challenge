"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDebugPage() {
  const [cookies, setCookies] = useState<string>("")

  useEffect(() => {
    setCookies(document.cookie)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cookie Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="font-bold mb-2">Current Cookies:</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto">{cookies || "No cookies found"}</pre>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                document.cookie = "admin_auth=authenticated; path=/; max-age=86400"
                setCookies(document.cookie)
              }}
            >
              Set Admin Cookie
            </button>
            <button
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md ml-2"
              onClick={() => {
                document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                setCookies(document.cookie)
              }}
            >
              Clear Admin Cookie
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

