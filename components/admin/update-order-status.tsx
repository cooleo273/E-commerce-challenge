"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface UpdateOrderStatusProps {
  orderId: string
  currentStatus: string
}

export default function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleUpdateStatus() {
    if (status === currentStatus) return

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update order status")
      }

      router.refresh()
    } catch (error: any) {
      setError(error.message)
      setStatus(currentStatus) // Reset to current status on error
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="PROCESSING">Processing</SelectItem>
          <SelectItem value="SHIPPED">Shipped</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleUpdateStatus} disabled={isUpdating || status === currentStatus} size="sm">
        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

