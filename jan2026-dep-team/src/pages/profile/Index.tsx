import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ChangePasswordModal from "../../common/components/ChangePasswordModal"
import ForgotPasswordModal from "../../common/components/ForgotPasswordModal"
import { RootState } from "../../store/reducers"
import { updateProfile } from "../../store/auth/actions"

type ProfileForm = {
  name: string
  email: string
  phone: string
  address: string
}

type ProfileErrors = Partial<Record<keyof ProfileForm, string>>

const PROFILE_FALLBACK_IMAGE =
  "/no-profile-avatar.svg"

const Profile: React.FC = () => {
  const dispatch = useDispatch<any>()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const [isEditing, setIsEditing] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [saveError, setSaveError] = useState(false)
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [profileImage, setProfileImage] = useState(currentUser?.image || "")
  const [profileImageError, setProfileImageError] = useState("")
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  const addressStorageKey = useMemo(() => {
    const userId = currentUser?.id || currentUser?._id || currentUser?.email || "default"
    return `profile_address_${userId}`
  }, [currentUser])

  const initialForm = useMemo<ProfileForm>(
    () => ({
      name: currentUser?.name || currentUser?.username || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || currentUser?.phoneNumber || "",
      address: localStorage.getItem(addressStorageKey) || currentUser?.address || "",
    }),
    [addressStorageKey, currentUser]
  )

  const [form, setForm] = useState<ProfileForm>(initialForm)

  useEffect(() => {
    setForm(initialForm)
  }, [initialForm])

  useEffect(() => {
    setProfileImage(currentUser?.image || "")
  }, [currentUser?.image])

  const validate = () => {
    const nextErrors: ProfileErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required."
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required."
    } else if (!/^[+]?[(]?[0-9\s-()]{7,20}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number."
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (errors[name as keyof ProfileForm]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }))
    }
  }

  const handleEdit = () => {
    setSaveMessage("")
    setSaveError(false)
    setErrors({})
    setProfileImageError("")
    setIsEditing(true)
  }

  const handleOpenChangePassword = () => {
    setSaveMessage("")
    setSaveError(false)
    setIsChangePasswordOpen(true)
  }

  const handleForgotPasswordRedirect = () => {
    setIsChangePasswordOpen(false)
    setIsForgotPasswordOpen(true)
  }

  const handlePasswordChangeSuccess = (message: string) => {
    setSaveError(false)
    setSaveMessage(message)
    setIsChangePasswordOpen(false)
  }

  const handleCancel = () => {
    setForm(initialForm)
    setProfileImage(currentUser?.image || "")
    setErrors({})
    setSaveMessage("")
    setSaveError(false)
    setProfileImageError("")
    setIsEditing(false)
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setProfileImageError("Please select a valid image file.")
      return
    }

    const maxFileSizeInBytes = 2 * 1024 * 1024
    if (file.size > maxFileSizeInBytes) {
      setProfileImageError("Image size should be 2MB or less.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setProfileImage(result)
      setProfileImageError("")
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    dispatch(
      updateProfile(
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          avatar: profileImage || currentUser?.image,
        },
        () => {
          localStorage.setItem(addressStorageKey, form.address.trim())
          setSaveError(false)
          setSaveMessage("Profile updated successfully.")
          setIsEditing(false)
        },
        () => {
          setSaveError(true)
          setSaveMessage("Failed to save changes. Please try again.")
        }
      )
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 py-6 sm:py-10">
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onForgotPassword={handleForgotPasswordRedirect}
        onSuccess={handlePasswordChangeSuccess}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={form.email || currentUser?.email || ""}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="bg-gray-800 px-6 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={profileImage || currentUser?.image || PROFILE_FALLBACK_IMAGE}
                  alt={form.name || "User profile"}
                  className="h-20 w-20 rounded-full border-4 border-white/30 object-cover shadow-md"
                />
                <div>
                  <p className="text-sm font-medium text-gray-300">My Profile</p>
                  <h1 className="text-2xl font-semibold sm:text-3xl">{form.name || "Profile details"}</h1>
                  <p className="mt-1 text-sm text-gray-300">
                    Manage your personal information and keep your contact details up to date.
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr,1.4fr] lg:px-10 lg:py-10">
            <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.name || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">{form.email || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.phone || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{form.address || "No address added yet"}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
                  <p className="mt-1 text-sm text-gray-500">Update your name, phone number, and address.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenChangePassword}
                  className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Change Password
                </button>
              </div>

              {saveMessage ? (
                <div
                  className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                    saveError
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {saveMessage}
                </div>
              ) : null}

              <form className="mt-6 space-y-5" onSubmit={handleSave} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                    {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      readOnly
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 shadow-sm"
                    />
                    {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                    {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={4}
                      value={form.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                      placeholder="Add your address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
                      Profile Picture <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="profilePic"
                      name="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                    {profileImageError ? <p className="mt-1 text-sm text-red-600">{profileImageError}</p> : null}
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
