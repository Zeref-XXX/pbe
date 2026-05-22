import { HeartIcon, StarIcon } from "@heroicons/react/outline"
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from "@heroicons/react/solid"

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toggleBookmark } from "../../../store/products/actions"
import { RootState } from "../../../store/reducers"
import { IProduct } from "../../../interfaces/Product"

interface Props {
  product: IProduct
  onBookmarkRemove?: (product: IProduct) => boolean
}

const SingleProduct = ({ product, onBookmarkRemove }: Props) => {
  const bookmarkIds: number[] = useSelector((state: RootState) => state.products.bookmarkedIds)
  const dispatch = useDispatch<any>()
  const ratingValue = Math.max(0, Math.min(5, Number(product?.rating?.rate || 0)))
  const handleBookmarkChange = (e) => {
    const isCurrentlyBookmarked = bookmarkIds.includes(product.id)
    if (isCurrentlyBookmarked && onBookmarkRemove) {
      if (!onBookmarkRemove(product)) {
        return
      }
    }
    dispatch(toggleBookmark(product.id))
  }

  return (
    <>
      <div key={product.id} className="relative p-5 shadow hover:shadow-xl rounded-md">
        <button className="absolute z-10 top-2 right-2 bg-white rounded-3xl" onClick={handleBookmarkChange}>
          {bookmarkIds.includes(product.id) ? (
            <HeartIconSolid className="m-3 h-7 w-7 text-pink-400 hover:text-pink-600" />
          ) : (
            <HeartIcon className="m-3 h-7 w-7 text-pink-400 hover:text-pink-600" />
          )}
        </button>
        <div className="w-full min-h-60 bg-gray-200 aspect-w-3 aspect-h-4 rounded-md overflow-hidden lg:h-60">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-center object-fill lg:w-full lg:h-full"
          />
        </div>
        <div className="mt-4 flex flex-col justify-between">
          <h3 className="text-sm text-gray-700 text-ellipsis truncate" title={product.title}>
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <span className="flex items-center gap-1" aria-label={`Rated ${ratingValue.toFixed(1)} out of 5`}>
              {Array.from({ length: 5 }, (_, starIndex) => {
                // Calculate the fill percentage for each star based on the rating value
                const fillPercent = Math.max(0, Math.min(1, ratingValue - starIndex)) * 100
                // Use absolute positioning to overlay the filled star on top of the gray star, controlling the width to show partial fills
                return (
                  <span key={starIndex} className="relative h-5 w-5 flex-shrink-0">
                    <StarIconSolid className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                      <StarIconSolid className="h-5 w-5 text-yellow-300" aria-hidden="true" />
                    </span>
                  </span>
                )
              })}
            </span>
            <span>
              {product.rating.count} 
            </span>
          </div>
          {/* Total Reviews:{product.rating.count} */}
          <p className="text-sm mt-[5px] font-medium text-gray-900">${product.price}</p>
          <p className="mt-1 text-sm text-green-600">{product.category.toUpperCase()}</p>
        </div>
      </div>
    </>
  )
}

export default SingleProduct
