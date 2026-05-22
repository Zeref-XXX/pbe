import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/reducers"
import { markAllAsRead } from "../../store/notifications/actions"

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ")
}

const Notifications: React.FC = () => {
  const notifications = useSelector((state: RootState) => state?.notifications?.notifications || [])
  const dispatch = useDispatch<any>()
  const unreadCount = notifications.filter((n: any) => !n.read).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <li key={notification.id}>
                <div
                  className={classNames(
                    notification.read ? "bg-white" : "bg-blue-50",
                    "block hover:bg-gray-50 transition duration-150 ease-in-out"
                  )}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.message}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        {!notification.read && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-8 text-center text-gray-500">
              No notifications available.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Notifications
