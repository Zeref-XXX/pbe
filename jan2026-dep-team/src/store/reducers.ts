import { combineReducers } from "redux"
import { AuthReducer } from "./auth"
import { ProductsReducer } from "./products"
import { NotificationsReducer } from "./notifications"
import { CartReducer } from "./cart"

const reducers = combineReducers({
  auth: AuthReducer,
  products: ProductsReducer,
  notifications: NotificationsReducer,
  cart: CartReducer,
})

export type RootState = ReturnType<typeof reducers>
export default reducers
