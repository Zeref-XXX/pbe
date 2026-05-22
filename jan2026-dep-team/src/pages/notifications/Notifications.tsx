import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../store/reducers"
import { markAllAsRead } from "../../store/notifications/actions"

const Notifications: React.FC = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow rounded-xl overflow-hidden divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No notifications yet 🎉</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : "bg-white"
                }`}
              >
                {/* Read/Unread Indicator */}
                <span
                  className={`mt-2 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    !notification.read ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></span>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      !notification.read
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 font-normal"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>

                {!notification.read && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
// implemented notification icon functionality.
