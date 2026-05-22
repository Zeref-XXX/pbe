import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ICredentials } from "../../interfaces/Auth"
import Loader from "../../common/components/Loader"
import ForgotPasswordModal from "../../common/components/ForgotPasswordModal"
import { attemptLogin } from "../../store/auth/actions"
import { RootState } from "../../store/reducers"

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const dispatch = useDispatch<any>()
  const initialCredentials: ICredentials = {
    email: "",
    password: "",
  }
  const [credentials, setCredentials] = useState<ICredentials>(initialCredentials)
  const [formErrors, setFormErrors] = useState<string>("")

  const isLoggedIn = useSelector((state: RootState) => state?.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/products")
    }
  }, [isLoggedIn, navigate])

  /**
   * Redirect to products page on success.
   */
  const handleOnSuccess = () => {
    setLoading(false)
    navigate("/products")
  }

  /**
   * Attempt login with credentials provided.
   * @param e
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    dispatch(
      attemptLogin(credentials, handleOnSuccess, (error) => {
        setLoading(false)
        if (error.response.status === 401) {
          setCredentials(initialCredentials)
          setFormErrors("Invalid credentials")
        }
      })
    )
  }

  /**
   * Bind the input value to the credentials object.
   * @param e
   */
  const handleChange = (e) => {
    e.persist()
    setCredentials((credentials) => ({ ...credentials, [e.target.name]: e.target.value }))
  }
  return (
    <>
      <ForgotPasswordModal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />
      <div className="h-screen items-center flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {loading ? <Loader /> : null}
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-24 w-auto"
            src="/LogoImage.png"
            alt="ShopEase Logo"
          />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md border rounded-md border-gray-200 shadow-2xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {formErrors ? (
              <div className="text-red-500 border border-red-500 p-2 text-center mb-6 rounded">{formErrors}</div>
            ) : null}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="******************"
                    onChange={handleChange}
                    value={credentials.password}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none p-0 cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <span onClick={() => navigate('/register')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  Register / Sign Up
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
