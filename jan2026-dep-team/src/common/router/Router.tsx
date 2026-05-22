import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RootState } from "../../store/reducers"
import Navbar from "../../layouts/Navbar"
import Login from "../../pages/auth/Login"
import Registration from "../../pages/auth/Registration"
import Details from "../../pages/products/Details"
import Products from "../../pages/products/Index"
import Notifications from "../../pages/notifications/Index"
import Cart from "../../pages/cart/Cart"
import Profile from "../../pages/profile/Index"
import Bookmarks from "../../pages/bookmarks/Index"

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

const Router = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  return (
    <BrowserRouter>
      {isLoggedIn ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/products" : "/login"} replace />} />
        
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Login />} 
        />
        
        <Route 
          path="/register" 
          element={isLoggedIn ? <Navigate to="/products" replace /> : <Registration />} 
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Details />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isLoggedIn ? "/products" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
