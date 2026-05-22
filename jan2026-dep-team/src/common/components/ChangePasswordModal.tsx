import React, { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useDispatch } from "react-redux"
import { changePassword } from "../../store/auth/actions"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onForgotPassword: () => void
  onSuccess?: (message: string) => void
}

const inputCls =
  "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

const btnPrimary =
  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"

const btnSecondary =
  "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onForgotPassword,
  onSuccess,
}) => {
  const dispatch = useDispatch<any>()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const resetState = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setError("")
    setLoading(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleForgotPassword = () => {
    resetState()
    onClose()
    onForgotPassword()
  }

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!currentPassword.trim() || !newPassword || !confirmNewPassword) {
      setError("All password fields are required.")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.")
      return
    }

    setLoading(true)

    dispatch(
      changePassword(
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        (response) => {
          setLoading(false)
          resetState()
          onClose()
          onSuccess?.(response?.message || "Password changed successfully.")
        },
        (err) => {
          setLoading(false)
          setError(err?.response?.data?.message || "Failed to change password. Please try again.")
        }
      )
    )
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl sm:p-8">
                <Dialog.Title className="mb-1 text-xl font-bold text-gray-900">
                  Change password
                </Dialog.Title>
                <p className="mb-5 text-sm text-gray-500">
                  Enter your current password, then choose and confirm a new one.
                </p>

                {error ? (
                  <div className="mb-4 rounded border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="mb-1 block text-sm font-medium text-gray-700">
                      Current password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">
                      New password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-new-password" className="mb-1 block text-sm font-medium text-gray-700">
                      Confirm new password
                    </label>
                    <input
                      id="confirm-new-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>

                  <div className="text-right text-sm">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot current password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className={btnPrimary}>
                    {loading ? "Updating..." : "Update password"}
                  </button>
                  <button type="button" onClick={handleClose} className={btnSecondary}>
                    Cancel
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ChangePasswordModal