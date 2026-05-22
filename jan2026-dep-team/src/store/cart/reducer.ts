// cart reducers
import { ICartItem } from "../../interfaces/Cart"
import { SET_CART, CLEAR_CART } from "./type"

interface ICartState {
  items: ICartItem[]
}

const initialState: ICartState = {
  items: [],
}

const CartReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case SET_CART:
      return {
        ...state,
        items: actions.payload.items,
      }

    case CLEAR_CART:
      return {
        ...state,
        items: [],
      }

    default:
      return state
  }
}

export default CartReducer
