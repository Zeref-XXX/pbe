import { HeartIcon, PlusIcon, StarIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getSingleProduct, toggleBookmark } from "../../store/products/actions"
import { addToCart } from "../../store/cart/actions"
import { RootState } from "../../store/reducers"
import Loader from "../../common/components/Loader"
import { IProduct } from "../../interfaces/Product"
import Api from "../../common/helpers/Api"

const Details: React.FC = () => {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false)
  const [selectedSize, setSelectedSize] = useState("SM")
  const [addedToCart, setAddedToCart] = useState(false)

  const dispatch = useDispatch<any>()
  const product: IProduct = useSelector((state: RootState) => state.products.singleProduct)
  const bookmarkIds: number[] = useSelector((state: RootState) => state.products.bookmarkedIds)
  const ratingValue = Math.max(0, Math.min(5, Number(product?.rating?.rate || 0)))

  useEffect(() => {
    setLoading(true)
    setSelectedColor(0)
    setSelectedImage(0)
    setRating(0)
    setHoverRating(0)
    setSubmittedRating(null)
    dispatch(
      getSingleProduct(Number(params.id), () => {
        setLoading(false)
      })
    )
  }, [dispatch, params.id])

  const currentImages = product?.colors?.[selectedColor]?.images ?? (product?.image ? [product.image] : [])
  const displayImage = currentImages[selectedImage] || product?.image

  /**
   * Toggle bookmark
   * @param e
   */
  const handleBookmarkChange = (e) => {
    dispatch(toggleBookmark(product.id))
  }

  const handleSubmitRating = async () => {
    if (!product?.id || rating <= 0 || submittingRating) {
      return
    }

    try {
      setSubmittingRating(true)
      await Api.post(`/products/${product.id}/rating`, { rating })
      setSubmittedRating(rating)
      setRating(0)
      setHoverRating(0)
      dispatch(getSingleProduct(product.id, () => {}))
    } catch (error) {
      console.log(error)
    } finally {
      setSubmittingRating(false)
    }
  }

  const handleAddToCart = () => {
    const colorName = product?.colors?.[selectedColor]?.color || ""
    dispatch(
      addToCart(
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: displayImage || product?.image || "",
          color: colorName,
          size: selectedSize,
          quantity: 1,
        },
        () => {
          setAddedToCart(true)
          setTimeout(() => setAddedToCart(false), 2000)
        }
      )
    )
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="text-gray-700 overflow-hidden">
          <div className="container px-5 py-10 mx-auto bg-white">
            <div className="border-b border-gray-200 mb-10 text-xxl">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-5">{product?.title}</h1>
            </div>
            <div className="lg:w-full mx-auto flex flex-wrap">
              <div className="border border-gray-200 rounded p-[20px] shadow">
                <img
                  className="lg:w-[500px] h-[500px] w-full object-fill object-center"
                  src={displayImage}
                  alt={product?.title}
                />
                {currentImages.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {currentImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`view ${idx + 1}`}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-16 h-16 object-cover cursor-pointer rounded flex-shrink-0 ${
                          selectedImage === idx
                            ? "border-2 border-indigo-600"
                            : "border border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">{product?.category.toUpperCase()}</h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product?.title}</h1>
                <div className="flex mb-4">
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1" aria-label={`Rated ${ratingValue.toFixed(1)} out of 5`}>
                      {Array.from({ length: 5 }, (_, starIndex) => {
                        const fillPercent = Math.max(0, Math.min(1, ratingValue - starIndex)) * 100

                        return (
                          // Use absolute positioning to overlay the filled star on top of the gray star, controlling the width to show partial fills
                          <span key={starIndex} className="relative h-5 w-5 flex-shrink-0">
                            <StarIconSolid className="h-5 w-5 text-gray-300" aria-hidden="true" />
                            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                              <StarIconSolid className="h-5 w-5 text-yellow-300" aria-hidden="true" />
                            </span>
                          </span>
                        )
                      })}
                    </span>
                    <span className="text-gray-600">{ratingValue.toFixed(1)} / {product?.rating.count} Reviews</span>
                  </span>
                </div>
                {/* Interactive user rating */}
                <div className="mt-3 mb-2">
                  {submittedRating !== null ? (
                    <p className="text-sm text-green-600 font-medium">You have rated this product {submittedRating} / 5 ⭐</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mb-1">Rate this product:</p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const activeVal = hoverRating || rating
                          const fillPercent =
                            activeVal >= star ? 100 :
                            activeVal >= star - 0.5 ? 50 :
                            0
                          return (
                            <span
                              key={star}
                              className="relative h-7 w-7 flex-shrink-0 cursor-pointer"
                            >
                              {/* gray base */}
                              <StarIconSolid className="h-7 w-7 text-gray-300" aria-hidden="true" />
                              {/* yellow fill overlay */}
                              <span
                                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                                style={{ width: `${fillPercent}%` }}
                              >
                                <StarIconSolid className="h-7 w-7 text-yellow-400" aria-hidden="true" />
                              </span>
                              {/* left half — sets 0.5 */}
                              <span
                                className="absolute inset-y-0 left-0 w-1/2"
                                onMouseEnter={() => setHoverRating(star - 0.5)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star - 0.5)}
                              />
                              {/* right half — sets full star */}
                              <span
                                className="absolute inset-y-0 right-0 w-1/2"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                              />
                            </span>
                          )
                        })}
                        {rating > 0 && (
                        // Show submit and cancel buttons when a rating is selected

                          <>
                            <button
                              onClick={handleSubmitRating}
                              disabled={submittingRating}
                              className="ml-2 text-green-600 hover:text-green-800 text-sm font-bold"
                              title="Submit rating"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => { setRating(0); setHoverRating(0); }}
                              className="ml-1 text-red-500 hover:text-red-700 text-sm font-bold"
                              title="Cancel"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                      {rating > 0 && (
                        <p className="text-xs text-gray-400 mt-1">{rating} / 5 selected</p>
                      )}
                    </>
                  )}
                </div>
                <p className="leading-relaxed">{product?.description}</p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="mr-1">Color</span>
                    {product?.colors?.map((c, idx) => (
                      <button
                        key={c.color}
                        onClick={() => {
                          setSelectedColor(idx)
                          setSelectedImage(0)
                        }}
                        className={`px-3 py-1 rounded border text-xs capitalize focus:outline-none ${
                          selectedColor === idx
                            ? "border-indigo-600 text-indigo-600 font-semibold"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {c.color}
                      </button>
                    ))}
                  </div>
                  <div className="flex ml-6 items-center">
                    <span className="mr-3">Size</span>
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-red-500 text-base pl-3 pr-10"
                      >
                        <option>SM</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">${product?.price}</span>
                  <button
                    onClick={handleAddToCart}
                    className={`flex ml-auto text-white border border-transparent border-0 py-2 px-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 rounded ${
                      addedToCart ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    <PlusIcon className="flex justify-around h-5 w-5 mr-1" aria-hidden="true" />
                    {addedToCart ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBookmarkChange}
                    className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-pink-400 hover:text-pink-600 ml-4"
                  >
                    {bookmarkIds.includes(product?.id) ? (
                      <HeartIconSolid className="m-3 h-8 w-8 text-pink-400 hover:text-pink-700" />
                    ) : (
                      <HeartIcon className="m-3 h-8 w-8 text-pink-400 hover:text-pink-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Details
