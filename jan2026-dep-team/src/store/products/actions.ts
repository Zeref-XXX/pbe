import { SET_BOOKMARKS, SET_FILTERED_PRODUCTS, SET_PRODUCTS, SET_SINGLE_PRODUCT } from "./type"
import Api from "../../common/helpers/Api"

/**
 * Fetch all the products from the API.
 * @param onSuccess
 */
export const getProducts = (onSuccess) => async (dispatch) => {
  try {
    const response = await Api.get("/products")
    dispatch({
      type: SET_PRODUCTS,
      payload: response.data,
    })
    dispatch({
      type: SET_FILTERED_PRODUCTS,
      payload: response.data,
    })
    onSuccess()
  } catch (error) {
    console.log(error)
  }
}

/**
 * Filter the products by the given category, query and sortBy params.
 * @param params
 * @param onSuccess
 */
export const filterProducts = (params, onSuccess) => async (dispatch, getState) => {
  const products = getState().products.products
  let filteredProducts = [...products]

  if (params.q) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.title.toLowerCase().includes(params.q.toLowerCase())
    })
  }

  if (params.category) {
    if (params.category.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        return params.category.includes(product.category)
      })
    }
  }

  if (typeof params.minPrice === "number") {
    filteredProducts = filteredProducts.filter((product) => product.price >= params.minPrice)
  }

  if (typeof params.maxPrice === "number") {
    filteredProducts = filteredProducts.filter((product) => product.price <= params.maxPrice)
  }

  if (params.sortBy) {
    filteredProducts = filteredProducts.sort((a, b) => {
      if (params.sortBy === "rating") {
        return b.rating.rate - a.rating.rate
      }
      if (params.sortBy === "price_low_high") {
        return a.price - b.price
      }
      if (params.sortBy === "price_high_low") {
        return b.price - a.price
      }

      return 1
    })
  }

  dispatch({
    type: SET_FILTERED_PRODUCTS,
    payload: filteredProducts,
  })
  onSuccess()
}

/**
 * Get single product by providedId.
 * @param productId
 * @param onSuccess
 */
export const getSingleProduct = (productId: number, onSuccess) => async (dispatch) => {
  try {
    const response = await Api.get(`/products/${productId}`)
    dispatch({
      type: SET_SINGLE_PRODUCT,
      payload: response.data,
    })
    onSuccess()
  } catch (error) {
    console.log(error)
  }
}

/**
 * Fetch bookmarks from the API.
 */
export const getBookmarks = () => async (dispatch) => {
  try {
    const response = await Api.get("/bookmarks")
    dispatch({
      type: SET_BOOKMARKS,
      payload: response.data,
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Toggle a bookmark via the API.
 * @param productId
 */
export const toggleBookmark = (productId: number) => async (dispatch) => {
  try {
    const response = await Api.post("/bookmarks/toggle", { productId })
    dispatch({
      type: SET_BOOKMARKS,
      payload: response.data,
    })
  } catch (error) {
    console.log(error)
  }
}
