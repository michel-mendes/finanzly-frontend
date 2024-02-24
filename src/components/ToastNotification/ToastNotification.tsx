import { useEffect, useRef, useState } from "react"

// Types
import { IToastNotificationProps, IToastTypeProps, IToastTypes, IToastsContainerProps } from "./types"

// Hooks
import { useToastNotification } from "../../hooks/useToastNotification"

// Icons from react-icons
import { IoMdAlert, IoMdCheckmarkCircle, IoMdCloseCircle, IoIosClose } from "react-icons/io"
import { IoInformationCircle } from "react-icons/io5"

// Styles
import styles from "./ToastNotification.module.css"


function ToastNotification({ message, type, id }: IToastNotificationProps) {
    const { icon, iconClass, progressBarClass } = getToastType(type)
    const toastNotification = useToastNotification()

    const [dismissedNotification, setDismissedNotification] = useState(false)

    const timerId = useRef<NodeJS.Timeout>()
    const progressBarRef = useRef<HTMLDivElement>(null)

    function handleDismissNotification() {
        setDismissedNotification(true)
        setTimeout(() => { toastNotification.removeToastNotification(id) }, 4000)
    }

    function handleMouseEnter() {
        clearTimeout(timerId.current)
        progressBarRef.current!.style.animationPlayState = "paused"
    }

    function handleMouseLeave() {
        const remainingTime = (progressBarRef.current!.offsetWidth / progressBarRef.current!.parentElement!.offsetWidth) * 4000

        progressBarRef.current!.style.animationPlayState = "running"

        timerId.current = setTimeout(handleDismissNotification, remainingTime)
    }


    // Adds a 4 seconds timer to perform notification auto-removal
    useEffect(() => {
        timerId.current = setTimeout(handleDismissNotification, 4000)

        // Clear the timer when the component is unmounted
        return () => { clearTimeout(timerId.current) }
    }, [])

    return (
        <div className={`${styles.toast} ${dismissedNotification ? styles.toast_dismissed : null}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <span className={iconClass}>{icon}</span>
            <p className={styles.toast_message}>{message}</p>
            <button className={styles.dismiss_btn} onClick={handleDismissNotification}>
                <IoIosClose className={styles.dismiss_btn_icon} color="#aeb0d7" />
            </button>

            {/* Progress bar */}
            <div className={styles.toast_progress}>
                <div ref={progressBarRef} className={`${styles.toast_progress_bar} ${progressBarClass}`}></div>
            </div>
        </div>
    )
}

function ToastsContainer({ toastNotifications }: IToastsContainerProps) {
    return (
        <div className={styles.toasts_container}>
            {
                toastNotifications.map(toast => {
                    return <ToastNotification key={toast.id} {...toast} />
                })
            }
        </div>
    )
}

function getToastType(type: keyof IToastTypes):IToastTypeProps {
    
    // Set toast types
    const toastNotificationTypes: IToastTypes = {
        success: {
            icon: <IoMdCheckmarkCircle className={styles.toast_icon} />,
            iconClass: styles.success_icon,
            progressBarClass: styles.success,
        },
        warning: {
            icon: <IoMdAlert className={styles.toast_icon} />,
            iconClass: styles.warning_icon,
            progressBarClass: styles.warning,
        },
        info: {
            icon: <IoInformationCircle className={styles.toast_icon} />,
            iconClass: styles.info_icon,
            progressBarClass: styles.info,
        },
        error: {
            icon: <IoMdCloseCircle className={styles.toast_icon} />,
            iconClass: styles.error_icon,
            progressBarClass: styles.error,
        }
    }

    // return based on "type" parameter
    return toastNotificationTypes[type]
}

export { ToastNotification, ToastsContainer }