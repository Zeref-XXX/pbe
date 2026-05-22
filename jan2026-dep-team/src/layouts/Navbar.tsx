import { Disclosure, Menu, Popover, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, XIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/outline"
import React, { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"
import { logOut } from "../store/auth/actions"
import { markAllAsRead } from "../store/notifications/actions"
import { getCart } from "../store/cart/actions"
import { getBookmarks } from "../store/products/actions"
import { RootState } from "../store/reducers"

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

const Navbar: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state?.auth.isLoggedIn)
  const currentUser = useSelector((state: RootState) => state?.auth.currentUser)
  const notifications = useSelector((state: RootState) => state?.notifications?.notifications || [])
  const unreadCount = notifications.filter((n: any) => !n.read).length
  const dispatch = useDispatch<any>()
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path: string) => {
    return !!matchPath(location.pathname, path)
  }

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const bookmarkCount = useSelector((state: RootState) => state.products.bookmarkedIds).length

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCart())
      dispatch(getBookmarks())
    }
  }, [dispatch, isLoggedIn])

  const handleLogOut = async (e) => {
    e.preventDefault()

    dispatch(
      logOut(() => {
        navigate("/login")
      })
    )
  }
  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50" >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8" >
            <div className="relative z-40 flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start" >
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-10 w-auto"
                    src="/LogoImage.png"
                    alt="ShopEase"
                  />
                  <img
                    className="hidden lg:block h-10 w-auto"
                    src="/LogoImage.png "
                    alt="ShopEase"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {isLoggedIn ? (
                      <Link
                        to="/products"
                        className={classNames(
                          isActive("/products")
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                      >
                        Products
                      </Link>
                    ) : (
                      <Link
                        to="/auth/login"
                        className={classNames(
                          isActive("/auth/login")
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              {isLoggedIn ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Cart button */}
                  <Link
                    to="/cart"
                    className="mr-2 relative bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View cart</span>
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  {/* Bookmarks button */}
                  <Link
                    to="/bookmarks"
                    className="mr-2 relative bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View bookmarks</span>
                    <HeartIcon className="h-6 w-6" aria-hidden="true" />
                    {bookmarkCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {bookmarkCount}
                      </span>
                    )}
                  </Link>
                  {/* <button
                    type="button"
                    className=" bg-gray-800 p-1 mr-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View cart</span>
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                          )}
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                              {unreadCount > 0 && (
                                <button
                                  onClick={() => dispatch(markAllAsRead())}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                  Mark all as read
                                </button>
                              )}
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {notifications.length > 0 ? (
                                notifications.map((notification: any) => (
                                  <div
                                    key={notification.id}
                                    className={classNames(
                                      notification.read ? "bg-white" : "bg-blue-50",
                                      "px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ease-in-out duration-150"
                                    )}
                                  >
                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                  No notifications
                                </div>
                              )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                              <Popover.Button as={Link} to="/notifications" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                Show all notifications
                              </Popover.Button>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            currentUser?.image ||
                            "/no-profile-avatar.svg"
                          }
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleLogOut}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : null}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn ? (
                <Link
                  to="/products"
                  className={classNames(
                    isActive("/products")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={isActive("/products") ? "page" : undefined}
                >
                  Products
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className={classNames(
                    isActive("/auth/login")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={isActive("/auth/login") ? "page" : undefined}
                >
                  Login
                </Link>
              )}
              {isLoggedIn ? (
                <Link
                  to="/cart"
                  className={classNames(
                    isActive("/cart")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={isActive("/cart") ? "page" : undefined}
                >
                  Cart {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              ) : null}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
// made the head to align with the EPAM standards header, and also integrated with teammates to add cart,notification icons functionlity