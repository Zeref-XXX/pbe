import { MARK_ALL_AS_READ } from "./types"

export const markAllAsRead = () => {
  return {
    type: MARK_ALL_AS_READ,
  }
}
