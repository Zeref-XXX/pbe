import {
  NotificationsState,
  NotificationActionTypes,
  MARK_ALL_AS_READ,
  MARK_AS_READ,
} from "./types"

const initialState: NotificationsState = {
  notifications: [
    {
      id: 1,
      message: "Your order has been shipped 🚚",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "New discount available 🎉",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Your item has been delivered 📦",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 4,
      message: "Payment received successfully ✅",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 5,
      message: "New product added to your wishlist ❤️",
      time: "1 day ago",
      read: true,
    },
  ],
}

export const NotificationsReducer = (
  state = initialState,
  action: NotificationActionTypes
): NotificationsState => {
  switch (action.type) {
    case MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
        })),
      }
    case MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }
    default:
      return state
  }
}
