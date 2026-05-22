import Axios, { AxiosInstance } from "axios"
import store from "../../store/index"
import { SET_AUTH } from "../../store/auth/type"

class Api {
  private readonly http: AxiosInstance

  constructor() {
    this.http = Axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
      timeout: 45000,
      withCredentials: true,
    })

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          if (
            !error.config.url.includes("/auth/login") &&
            !error.config.url.includes("/auth/register") &&
            !error.config.url.includes("/auth/me")
          ) {
            localStorage.removeItem("user")
            store.dispatch({
              type: SET_AUTH,
              payload: { isLoggedIn: false, currentUser: null },
            })
          }
        }
        return Promise.reject(error)
      }
    )
  }

  get(endpoint, query = {}) {
    return this.http.get(endpoint, { params: query })
  }

  post(endpoint, data) {
    return this.http.post(endpoint, data)
  }

  patch(endpoint, data) {
    return this.http.patch(endpoint, data)
  }

  put(endpoint, data) {
    return this.http.put(endpoint, data)
  }

  delete(endpoint, config?) {
    return this.http.delete(endpoint, config)
  }
}

export default new Api()