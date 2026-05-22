import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/reducers"
import { getProducts } from "../../store/products/actions"
import SingleProduct from "../products/partials/SingleProduct"
import { Link } from "react-router-dom"
import { IProduct } from "../../interfaces/Product"

const Bookmarks = () => {
  const dispatch = useDispatch<any>()
  const products = useSelector((state: RootState) => state.products.products)
  const bookmarkedIds = useSelector((state: RootState) => state.products.bookmarkedIds)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts(() => {}))
    }
  }, [dispatch, products.length])

  const bookmarkedProducts = products.filter((p) => bookmarkedIds.includes(p.id))

  const handleBookmarkRemove = (product: IProduct): boolean => {
    return confirm(`Are you sure you want to remove "${product.title}" from your wishlist?`)
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Your Wishlist</h2>

        {bookmarkedProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {bookmarkedProducts.map((product) => (
              <SingleProduct key={product.id} product={product} onBookmarkRemove={handleBookmarkRemove} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't added any products to your wishlist yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookmarks
