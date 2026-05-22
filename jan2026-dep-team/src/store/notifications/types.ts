export interface Notification {
  id: number
  message: string
  time: string
  read: boolean
}

export interface NotificationsState {
  notifications: Notification[]
}

export const MARK_ALL_AS_READ = "MARK_ALL_AS_READ"
export const MARK_AS_READ = "MARK_AS_READ"

interface MarkAllAsReadAction {
  type: typeof MARK_ALL_AS_READ
}

interface MarkAsReadAction {
  type: typeof MARK_AS_READ
  payload: number
}

export type NotificationActionTypes = MarkAllAsReadAction | MarkAsReadAction
