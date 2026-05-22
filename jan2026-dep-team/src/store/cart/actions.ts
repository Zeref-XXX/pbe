// cart functionalities
import { SET_CART } from "./type"
import { ICartItem } from "../../interfaces/Cart"
import Api from "../../common/helpers/Api"

const CART_STORAGE_KEY = "cart_items"

const getCartFromStorage = (): ICartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items: ICartItem[]): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export const getCart = (onSuccess?) => async (dispatch: any, getState: any) => {
  const { auth } = getState()

  if (auth.isLoggedIn) {
    try {
      const response = await Api.get("/cart")
      const items = response.data?.items || []
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to fetch cart from server", error)
      // Fallback to localStorage if API fails
      const items = getCartFromStorage()
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    }
  } else {
    const items = getCartFromStorage()
    dispatch({ type: SET_CART, payload: { items } })
    if (onSuccess) onSuccess()
  }
}

export const addToCart =
  (item: { productId: number; title: string; price: number; image: string; color: string; size: string; quantity: number }, onSuccess?) =>
  async (dispatch: any, getState: any) => {
    const { auth } = getState()

    if (auth.isLoggedIn) {
      try {
        const response = await Api.post("/cart", item)
        const items = response.data?.items || []
        dispatch({ type: SET_CART, payload: { items } })
        if (onSuccess) onSuccess()
      } catch (error) {
        console.error("Failed to add to cart on server", error)
      }
    } else {
      const items = getCartFromStorage()

      const existingIndex = items.findIndex(
        (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
      )

      if (existingIndex > -1) {
        items[existingIndex].quantity += item.quantity
      } else {
        items.push(item)
      }

      saveCartToStorage(items)
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    }
  }

export const updateCartItem =
  (item: { productId: number; color: string; size: string; quantity: number }, onSuccess?) =>
  async (dispatch: any, getState: any) => {
    const { auth } = getState()

    if (auth.isLoggedIn) {
      try {
        const response = await Api.put("/cart", item)
        const items = response.data?.items || []
        dispatch({ type: SET_CART, payload: { items } })
        if (onSuccess) onSuccess()
      } catch (error) {
        console.error("Failed to update cart item on server", error)
      }
    } else {
      const items = getCartFromStorage()

      const existingIndex = items.findIndex(
        (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
      )

      if (existingIndex > -1) {
        if (item.quantity <= 0) {
          items.splice(existingIndex, 1)
        } else {
          items[existingIndex].quantity = item.quantity
        }
      }

      saveCartToStorage(items)
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    }
  }

export const removeFromCart =
  (item: { productId: number; color: string; size: string }, onSuccess?) =>
  async (dispatch: any, getState: any) => {
    const { auth } = getState()

    if (auth.isLoggedIn) {
      try {
        const response = await Api.delete("/cart", { data: item })
        const items = response.data?.items || []
        dispatch({ type: SET_CART, payload: { items } })
        if (onSuccess) onSuccess()
      } catch (error) {
        console.error("Failed to remove cart item on server", error)
      }
    } else {
      let items = getCartFromStorage()

      items = items.filter(
        (i) => !(i.productId === item.productId && i.color === item.color && i.size === item.size)
      )

      saveCartToStorage(items)
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    }
  }

export const clearCart = (onSuccess?) => async (dispatch: any, getState: any) => {
  const { auth } = getState()

  if (auth.isLoggedIn) {
    try {
      const response = await Api.delete("/cart/clear")
      const items = response.data?.items || []
      dispatch({ type: SET_CART, payload: { items } })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to clear cart on server", error)
    }
  } else {
    saveCartToStorage([])
    dispatch({ type: SET_CART, payload: { items: [] } })
    if (onSuccess) onSuccess()
  }
}