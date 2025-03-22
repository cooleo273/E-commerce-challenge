export type Product = {
  id: string
  name: string
  price: number
  discount?: number
  inventory: number
  images: string[]
  category: {
    name: string
  }
  brand: {
    name: string
  }
}