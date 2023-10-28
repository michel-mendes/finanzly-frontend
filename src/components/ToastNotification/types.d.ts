export type TToastNotificationAction = | {type: "ADD_TOAST_NOTIFIER", payload: IToastNotificationProps}
                                       | {type: "DELETE_TOAST", payload: number}

export interface IToastsContainerProps {
    toastNotifications: Array<IToastNotificationProps>
}

export interface IToastNotificationProps {
    message: string,
    type: keyof IToastTypes,
    id: number
}

export interface IToastTypes {
    success: IToastTypeProps,
    warning: IToastTypeProps,
    info: IToastTypeProps,
    error: IToastTypeProps,
}

export interface IToastTypeProps {
    icon: JSX.Element,
    iconClass: string,
    progressBarClass: string
}

export interface IInitialContextState {
    toastNotifications: Array<IToastNotificationProps>
}

export interface IToastNotificationContextProps {
    showSuccessNotification: (message: string) => void;
    showWarningNotification: (message: string) => void;
    showInformationNotification: (message: string) => void;
    showErrorNotification: (message: string) => void;
    removeToastNotification: (id: number) => void;
}

export interface IToastNotificationState {
    toastNotifications: Array<IToastNotificationProps>
}