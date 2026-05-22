// interfaces for Cart Items and Cart
export interface ICartItem {
  productId: number
  title: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

export interface ICart {
  userId: string
  items: ICartItem[]
}
