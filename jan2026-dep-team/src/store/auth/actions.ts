import { SET_AUTH, SET_IS_LOGGED_IN } from "./type"
import Api from "../../common/helpers/Api"

const mapUserFromResponse = (data) => ({
  id: data._id,
  name: data.name,
  username: data.username,
  email: data.email,
  role: data.role,
  phone: data.phone || "",
  image:
    data.avatar ||
    "/no-profile-avatar.svg",
})

export const setAuth = (data) => {
  return {
    type: SET_AUTH,
    payload: data,
  }
}

export const setIsLoggedIn = (data) => {
  return {
    type: SET_IS_LOGGED_IN,
    payload: data,
  }
}

export const checkIfUserIsLoggedIn = () => async (dispatch) => {
  try {
    const response = await Api.get("/auth/me")
    const user = mapUserFromResponse(response.data)
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(
      setAuth({
        isLoggedIn: true,
        currentUser: user,
      })
    );
  } catch (error) {
    // Cookie expired, invalid, or manually removed
    localStorage.removeItem("user");
    dispatch(
      setAuth({
        isLoggedIn: false,
        currentUser: null,
      })
    );
  }
}

export const attemptLogin = (credentials, onSuccess, onError) => async (dispatch) => {
  try {
    const response = await Api.post("/auth/login", credentials)
    const user = mapUserFromResponse(response.data)
    localStorage.setItem("user", JSON.stringify(user))
    // Token is stored in httpOnly cookie by server, do not store in localStorage
 
    dispatch(
      setAuth({
        isLoggedIn: true,
        currentUser: user,
      })
    )

    onSuccess()
  } catch (err) {
    return onError(err)
  }
}

export const attemptRegister = (credentials, onSuccess, onError) => async (dispatch) => {
  try {
    await Api.post("/auth/register", credentials)
    onSuccess()
  } catch (err) {
    return onError(err)
  }
}

export const updateProfile = (profileData, onSuccess, onError) => async (dispatch) => {
  try {
    const response = await Api.patch("/auth/me", profileData)
    const user = mapUserFromResponse(response.data)

    localStorage.setItem("user", JSON.stringify(user))

    dispatch(
      setAuth({
        isLoggedIn: true,
        currentUser: user,
      })
    )

    onSuccess(user)
  } catch (err) {
    return onError(err)
  }
}

export const changePassword = (passwordData, onSuccess, onError) => async () => {
  try {
    const response = await Api.post("/auth/change-password", passwordData)
    onSuccess(response.data)
  } catch (err) {
    return onError(err)
  }
}

export const logOut = (onSuccess) => async (dispatch) => {
  try {
    await Api.post("/auth/logout", {})
  } catch (_error) {
    // Continue with local logout even if server call fails
  }

  localStorage.removeItem("user")
  dispatch(
    setAuth({
      isLoggedIn: false,
      currentUser: null,
    })
  )
  onSuccess()
}
