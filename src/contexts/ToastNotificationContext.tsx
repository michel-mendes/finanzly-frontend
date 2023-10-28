import { createContext, useReducer, PropsWithChildren } from "react";
import { toastNotificationReducer } from "../reducers/ToastNotificationReducer";
import { ToastsContainer } from "../components/ToastNotification/ToastNotification";

// Types
import { IInitialContextState, IToastNotificationContextProps, IToastTypes } from "../components/ToastNotification/types";


const initialState: IInitialContextState = {
    toastNotifications: []
}

const ToastNotificationContext = createContext<IToastNotificationContextProps>({
    showErrorNotification: () => {},
    showInformationNotification: () => {},
    showSuccessNotification: () => {},
    showWarningNotification: () => {},
    removeToastNotification: () => {}
})


function ToastNotificationContextProvider({ children }: PropsWithChildren) {
    const [state, dispatch] = useReducer(toastNotificationReducer, initialState)

    function addToastNotification(type: keyof IToastTypes, message: string) {
        const id = Math.floor(Math.random() * 99999999)

        dispatch({ type: "ADD_TOAST_NOTIFIER", payload: { id, message, type } })
    }

    function removeToastNotification(id: number) {
        dispatch({ type: "DELETE_TOAST", payload: id })
    }

    function showSuccessNotification(message: string) { addToastNotification("success", message) }
    function showWarningNotification(message: string) { addToastNotification("warning", message) }
    function showInformationNotification(message: string) { addToastNotification("info", message) }
    function showErrorNotification(message: string) { addToastNotification("error", message) }

    const contextProviderValue = { showSuccessNotification, showWarningNotification, showInformationNotification, showErrorNotification, removeToastNotification }

    return (
        <ToastNotificationContext.Provider value={contextProviderValue}>
            <ToastsContainer toastNotifications={state.toastNotifications} />
            {children}
        </ToastNotificationContext.Provider>
    )
}

export { ToastNotificationContext, ToastNotificationContextProvider }