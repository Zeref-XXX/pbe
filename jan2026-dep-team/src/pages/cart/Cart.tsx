// Cart Page after Add to Cart
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/outline"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Loader from "../../common/components/Loader"
import { ICartItem } from "../../interfaces/Cart"
import { getCart, updateCartItem, removeFromCart, clearCart } from "../../store/cart/actions"
import { RootState } from "../../store/reducers"

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<any>()
  const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    setLoading(true)
    dispatch(
      getCart(() => {
        setLoading(false)
      })
    )
  }, [dispatch])

  const handleQuantityChange = (item: ICartItem, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(
      updateCartItem({
        productId: item.productId,
        color: item.color,
        size: item.size,
        quantity: newQuantity,
      })
    )
  }

  const handleRemove = (item: ICartItem) => {
    dispatch(
      removeFromCart({
        productId: item.productId,
        color: item.color,
        size: item.size,
      })
    )
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div>
      {loading ? <Loader /> : null}

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="relative z-20 flex items-baseline justify-between pt-10 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ShoppingCartIcon className="h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
            <Link
              to="/products"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <section className="pt-6 pb-24">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              {/* Cart items */}
              <div className="lg:col-span-8">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li key={`${item.productId}-${item.color}-${item.size}-${index}`} className="flex py-6">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-center object-fill"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="pr-4">
                              <Link to={`/products/${item.productId}`} className="hover:text-indigo-600">
                                {item.title}
                              </Link>
                            </h3>
                            <p className="ml-4 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="mt-1 flex gap-4 text-sm text-gray-500">
                            {item.color && <p>Color: <span className="capitalize">{item.color}</span></p>}
                            {item.size && <p>Size: {item.size}</p>}
                          </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 text-gray-900 font-medium border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="p-2 text-gray-500 hover:text-gray-700"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="flex items-center text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-4 mt-10 lg:mt-0">
                <div className="bg-gray-50 rounded-lg px-6 py-6 shadow">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Total Items</dt>
                      <dd className="text-sm font-medium text-gray-900">{totalItems}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Subtotal</dt>
                      <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Checkout
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      to="/products"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Cart
