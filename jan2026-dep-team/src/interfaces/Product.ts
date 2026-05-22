export interface IProductColor {
  color: string
  images: string[]
}
 
export interface IProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  brand: string
  image: string
  rating: {
    rate: number
    count: number
  }
  colors: IProductColor[]
}
 
export interface IFilterParams {
  q: string
  category: string[]
  sortBy: string
  minPrice?: number
  maxPrice?: number
}