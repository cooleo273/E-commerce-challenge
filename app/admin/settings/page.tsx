"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Store settings
  const [storeName, setStoreName] = useState("Your E-commerce Store")
  const [storeEmail, setStoreEmail] = useState("contact@yourdomain.com")
  const [storePhone, setStorePhone] = useState("+1 (555) 123-4567")
  const [storeAddress, setStoreAddress] = useState("123 Main St, City, Country")

  // Payment settings
  const [enableStripe, setEnableStripe] = useState(true)
  const [enableChapa, setEnableChapa] = useState(true)
  const [enableCOD, setEnableCOD] = useState(true)

  // Shipping settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("100")
  const [standardShippingFee, setStandardShippingFee] = useState("10")

  // Email settings
  const [sendOrderConfirmation, setSendOrderConfirmation] = useState(true)
  const [sendShippingUpdates, setSendShippingUpdates] = useState(true)
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // In a real application, this would save to a database or API
    // For now, we'll just simulate a successful save
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess("Settings saved successfully")
    }, 1000)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="store">Store Information</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Contact Phone</Label>
                <Input id="storePhone" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input id="storeAddress" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableStripe" className="text-base">
                    Stripe Payments
                  </Label>
                  <p className="text-sm text-gray-500">Accept credit card payments via Stripe</p>
                </div>
                <Switch id="enableStripe" checked={enableStripe} onCheckedChange={setEnableStripe} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableChapa" className="text-base">
                    Chapa Payments
                  </Label>
                  <p className="text-sm text-gray-500">Accept payments via Chapa</p>
                </div>
                <Switch id="enableChapa" checked={enableChapa} onCheckedChange={setEnableChapa} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableCOD" className="text-base">
                    Cash on Delivery
                  </Label>
                  <p className="text-sm text-gray-500">Allow customers to pay when they receive their order</p>
                </div>
                <Switch id="enableCOD" checked={enableCOD} onCheckedChange={setEnableCOD} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>Configure shipping options and fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">Orders above this amount qualify for free shipping</p>
              </div>
              <div>
                <Label htmlFor="standardShippingFee">Standard Shipping Fee ($)</Label>
                <Input
                  id="standardShippingFee"
                  type="number"
                  value={standardShippingFee}
                  onChange={(e) => setStandardShippingFee(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure automated email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sendOrderConfirmation" className="text-base">
                    Order Confirmations
                  </Label>
                  <p className="text-sm text-gray-500">Send email confirmations when orders are placed</p>
                </div>
                <Switch
                  id="sendOrderConfirmation"
                  checked={sendOrderConfirmation}
                  onCheckedChange={setSendOrderConfirmation}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sendShippingUpdates" className="text-base">
                    Shipping Updates
                  </Label>
                  <p className="text-sm text-gray-500">Send emails when order status changes</p>
                </div>
                <Switch
                  id="sendShippingUpdates"
                  checked={sendShippingUpdates}
                  onCheckedChange={setSendShippingUpdates}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sendWelcomeEmail" className="text-base">
                    Welcome Emails
                  </Label>
                  <p className="text-sm text-gray-500">Send welcome emails to new customers</p>
                </div>
                <Switch id="sendWelcomeEmail" checked={sendWelcomeEmail} onCheckedChange={setSendWelcomeEmail} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {success && (
        <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

