// Types
import { IToastNotificationState, TToastNotificationAction } from "../components/ToastNotification/types"

function toastNotificationReducer(state: IToastNotificationState, action: TToastNotificationAction) {
    switch (action.type) {
        case "ADD_TOAST_NOTIFIER": {
            return { ...state, toastNotifications: [...state.toastNotifications, action.payload] }
        }
        case "DELETE_TOAST": {
            const updatedToastNotifications = state.toastNotifications.filter(toastNotification => {
                return toastNotification.id != action.payload
            })

            return { ...state, toastNotifications: updatedToastNotifications }
        }
        default: {
            throw new Error(`Tipo de ação inexistente: ${(action as any).type}`)
        }
    }
}

export { toastNotificationReducer }