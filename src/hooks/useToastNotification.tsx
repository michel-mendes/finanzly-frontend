import { useContext } from "react";
import { ToastNotificationContext } from "../contexts/ToastNotificationContext";

export function useToastNotification() {
    return useContext(ToastNotificationContext)
}